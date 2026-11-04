"""Builds data/vocab.json.

English phrases come from the ChewaTalk English Phrase List (levels 1-5).
Nyanja is filled in ONLY where the Peace Corps/Zambia PST 1995 Special Lessons
(Nyanja) document gives it. Everything else stays null ("pending") until a
speaker verifies it. Spelling is kept exactly as printed (1995 orthography uses
"c" where modern spelling often writes "ch", e.g. cakudya / chakudya).

Run:  python3 tools/build_vocab.py
"""
import json, re, pathlib

SRC = "Peace Corps/Zambia PST 1995 Special Lessons: Nyanja"

LEVELS = {
    1: ("Beginner", "First Words"),
    2: ("Elementary", "Everyday Vocabulary"),
    3: ("Intermediate", "Building Sentences"),
    4: ("Upper Intermediate", "Conversations"),
    5: ("Advanced", "Real-World Fluency"),
}

PHRASES = {
 1: {
  "Greetings": ["Hello","Hi","Good morning","Good afternoon","Good evening","Good night","Goodbye","See you later","How are you?","I am fine","Thank you","You're welcome","Please","Sorry","Excuse me"],
  "Introductions": ["What is your name?","My name is...","What is your surname?","Where are you from?","I am from Zambia","Where do you live?","I live here","Nice to meet you","How old are you?","I am a student"],
  "Basic Words": ["Yes","No","Maybe","Good","Bad","Big","Small","Hot","Cold","Happy","Sad","Here","There","Today","Tomorrow"],
  "Numbers": ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"],
 },
 2: {
  "Family": ["Mother","Father","Brother","Sister","Grandmother","Grandfather","Son","Daughter","Child","Baby","Husband","Wife","Uncle","Aunt","Family"],
  "Food and Drinks": ["Water","Food","Bread","Rice","Chicken","Fish","Meat","Milk","Tea","Sugar","Salt","Egg","Banana","Apple","Vegetables","I am hungry","I am thirsty","I want water","I like this food","The food is good"],
  "Colours": ["Red","Blue","Green","Yellow","Black","White","Orange","Purple","Brown","Pink","What colour is this?","This is red","I like blue","The car is black","My shirt is white"],
  "Animals": ["Dog","Cat","Cow","Goat","Chicken","Elephant","Lion","Monkey","Snake","Bird","Fish","Horse","Pig","Sheep","Rabbit"],
  "Common Actions": ["Eat","Drink","Sleep","Walk","Run","Sit","Stand","Come","Go","Stop","Look","Listen","Speak","Read","Write"],
 },
 3: {
  "Navigation and Directions": ["Where is the toilet?","Where is the bus station?","Where is the market?","Where is the hospital?","Where is the nearest shop?","How do I get there?","Turn left","Turn right","Go straight","Stop here","Come here","Follow me","I am lost","Is it far?","Is it near?","Where are you going?","I am going home","Take me to the market","I need a taxi","How long does it take?"],
  "Shopping": ["How much is this?","How much does it cost?","That is too expensive","Do you have a cheaper one?","I want to buy this","I don't want this","Do you have water?","Do you have change?","Can I pay now?","Where can I pay?","I need a bag","I am just looking","Can you help me?","I have no money","Thank you for your help"],
  "Questions": ["What is this?","Who is that?","Where are you?","Where do you live?","Where are you going?","What are you doing?","What do you want?","Why are you here?","When are you coming?","How do you know?","Do you understand?","Can you speak English?","Can you speak Nyanja?","What does this mean?","Can you repeat that?"],
  "Daily Activities": ["I am eating","I am drinking water","I am sleeping","I am working","I am studying","I am cooking","I am cleaning","I am going to school","I am going to work","I am going home","I am watching television","I am listening to music","I am playing football","I am reading a book","I am learning Nyanja"],
 },
 4: {
  "Social Conversations": ["How was your day?","My day was good","What did you do today?","I went to work","I went to school","What are you doing tomorrow?","I am going to see my friend","Do you want to come with me?","What time should we meet?","Let's meet tomorrow","I will call you later","I haven't seen you in a long time","I missed you","It was nice seeing you","Have a safe journey"],
  "Feelings and Opinions": ["I am very happy","I am feeling tired","I am not feeling well","I am worried","I am excited","I am scared","I am angry","I am confused","I think this is good","I don't think so","I agree with you","I disagree with you","I like this place","I don't like this food","What do you think?"],
  "Time and Plans": ["What time is it?","It is early","It is late","I will come tomorrow","I came yesterday","I am leaving now","I will be back soon","Wait for me","I am running late","I will see you next week","What are your plans?","Are you free tomorrow?","I am busy today","We can go together","I will let you know"],
  "Health and Emergencies": ["I need help","Please help me","I am sick","I have a headache","My stomach hurts","I need a doctor","Where is the hospital?","Call an ambulance","I need medicine","I feel better now","I am allergic to this","I cannot breathe properly","I have lost my phone","Someone has stolen my bag","Please call the police"],
 },
 5: {
  "Complex Conversations": ["I have been learning Nyanja for a few months","I understand a little, but I cannot speak fluently yet","Could you please speak more slowly?","I would like to improve my pronunciation","Can you explain what that word means?","I have never been here before","This is my first time visiting Zambia","I grew up in England, but my family is from Zambia","I would like to learn more about Zambian culture","I find it easier to understand than to speak","Sometimes I forget the words I have learned","I am trying to practise every day","Please correct me if I make a mistake","I understand what you are saying","I am not sure how to explain it"],
  "Storytelling and Experiences": ["Yesterday I went to the market with my family","When I was younger, I used to play football every day","Last year I visited my grandparents","I have always wanted to learn another language","When I arrived, everyone was waiting for me","I was tired because I had been working all day","We spent the afternoon talking and eating together","I remember visiting this place when I was a child","That was one of the best days of my life","I hope I can visit again next year"],
  "Opinions and Explanations": ["I believe learning languages is important","In my opinion, this is the best option","I understand your point, but I disagree","There are several reasons why I think this","It depends on the situation","I would prefer to do something different","I think we should discuss this first","I am not completely sure about that","Could you explain your reasoning?","That makes sense to me"],
  "Real-World Situations": ["If I have enough money, I will travel next month","If it rains tomorrow, we will stay at home","I would have come earlier, but I was working","Even though I was tired, I decided to continue","I need to find somewhere to stay for the night","Could you recommend a good place to eat?","I would appreciate it if you could help me","Please let me know when you arrive safely","I have been waiting here for almost an hour","I will contact you as soon as I have more information","I wish I had started learning Nyanja earlier","I am looking forward to meeting your family","I would like to know more about the local traditions","Thank you for taking the time to explain everything","I hope we can speak again sometime soon"],
 },
}

# (level, category, english) -> dict(nyanja, page, [sourceEnglish], [note], [status])
T = {
 (1,"Greetings","Hello"): dict(nyanja="Bwanji?", page=4, note="The source gives Bwanji? for Hello. It literally asks 'how?' and works as a casual greeting."),
 (1,"Greetings","How are you?"): dict(nyanja="Muli bwanji?", page=4, note="Plural or respectful. Informal, to one person: Uli bwanji?"),
 (1,"Greetings","I am fine"): dict(nyanja="Ndiri bwino", page=11),
 (1,"Greetings","Thank you"): dict(nyanja="Zikomo", page=6),
 (1,"Greetings","Sorry"): dict(nyanja="Pepani", page=5, sourceEnglish="I am sorry"),
 (1,"Greetings","Excuse me"): dict(nyanja="Ndikululukileni", page=5, note="Page 7 spells it Ndikululukireni."),
 (1,"Introductions","My name is..."): dict(nyanja="Dzina langa ndine...", page=4),
 (1,"Basic Words","Yes"): dict(nyanja="Inde", page=6),
 (1,"Basic Words","No"): dict(nyanja="Iai-ai", page=6, status="review", note="Faint print in the scan. Confirm the spelling with a speaker."),
 (1,"Basic Words","Maybe"): dict(nyanja="Kapena", page=6, sourceEnglish="Maybe / Perhaps"),
 (1,"Basic Words","Hot"): dict(nyanja="Kupya", page=7, note="Verb form: to be hot."),
 (1,"Basic Words","Cold"): dict(nyanja="Kuzizira", page=7, note="Verb form: to be cold."),
 (1,"Numbers","One"): dict(nyanja="Cimodzi", page=5, sourceEnglish="I want one: Ndifuna cimodzi", note="Number words change with the noun class. This is the form from the source sentence."),
 (1,"Numbers","Two"): dict(nyanja="Ziwiri", page=5, sourceEnglish="I don't want two: Sindifuna ziwiri", note="Number words change with the noun class. This is the form from the source sentence."),
 (2,"Family","Mother"): dict(nyanja="Mai", page=6),
 (2,"Family","Father"): dict(nyanja="Tate", page=6),
 (2,"Family","Brother"): dict(nyanja="Mlongo", page=6, note="The source gives Mlongo for both brother and sister."),
 (2,"Family","Sister"): dict(nyanja="Mlongo", page=6, note="The source gives Mlongo for both brother and sister."),
 (2,"Food and Drinks","Water"): dict(nyanja="Madzi", page=4),
 (2,"Food and Drinks","Food"): dict(nyanja="Cakudya", page=6, note="1995 spelling. Modern spelling: chakudya."),
 (2,"Common Actions","Drink"): dict(nyanja="Imwa", page=6),
 (2,"Common Actions","Sleep"): dict(nyanja="Kugona", page=7, sourceEnglish="To sleep"),
 (2,"Common Actions","Go"): dict(nyanja="Pita", page=7),
 (2,"Common Actions","Speak"): dict(nyanja="Lankhula", page=6),
 (2,"Common Actions","Write"): dict(nyanja="Lemba", page=6),
 (3,"Navigation and Directions","Where is the toilet?"): dict(nyanja="Kodi cimbudzi cili kuti?", page=4),
 (3,"Shopping","I don't want this"): dict(nyanja="Sinifuna ici", page=5, status="review", note="Printed as Sinifuna ici. Compare Sindifuna ziwiri (I don't want two), which suggests a typo. Confirm with a speaker."),
 (3,"Shopping","Can you help me?"): dict(nyanja="Munganithandizeko?", page=5, sourceEnglish="Can you help me please?"),
 (3,"Questions","Can you repeat that?"): dict(nyanja="Pepani bwelezamponi", page=5, sourceEnglish="Please repeat / I beg your pardon"),
 (4,"Feelings and Opinions","I am feeling tired"): dict(nyanja="Ndalema", page=4, sourceEnglish="I am tired"),
 (4,"Time and Plans","What time is it?"): dict(nyanja="Nthawi ili bwanji?", page=25),
 (4,"Health and Emergencies","I am sick"): dict(nyanja="Ndimvera kudwala", page=4, sourceEnglish="I feel sick"),
 (5,"Complex Conversations","Could you please speak more slowly?"): dict(nyanja="Mungalankhuleko pang'ono pang'ono", page=5, sourceEnglish="Would you speak more slowly"),
 (5,"Complex Conversations","Please correct me if I make a mistake"): dict(nyanja="Muzindikonza ngati ndakamba molakwa", page=5, sourceEnglish="Please correct me if I say something wrong"),
}

# Bonus track: Survival Kit entries straight from pages 4-7 that are not in the phrase list.
KIT = {
 "Greetings & People": [
  ("Welcome", "Fikani", 4, None), ("How are you, Mother?", "Muli bwanji Mai?", 4, None),
  ("How are you, Father?", "Muli bwanji Tate?", 4, None), ("Man", "Mwamuna", 6, None),
  ("Woman", "Mkazi", 6, None), ("Children", "Ana", 7, None), ("Stranger", "Mlendo", 6, None),
  ("Who?", "Ndani", 6, None), ("News", "Nkhani", 6, None),
 ],
 "Needs": [
  ("I want food", "Ndifuna cakudya", 4, None), ("I want to sleep", "Ndifuna kugona", 4, None),
  ("I want hot water", "Ndifuna madzi akupya", 4, None), ("I want cold water", "Ndifuna madzi ozizira", 4, None),
  ("Give me soap", "Ndipatseko sopo", 4, None), ("Give me water to drink", "Ndipatseko madzi akumwa", 4, None),
  ("I feel pain", "Ndibvera kupweteka", 4, "review:Printed as Ndibvera. Compare Ndimvera kudwala (I feel sick), which suggests a typo. Confirm with a speaker."),
  ("Hunger", "Njala", 7, None), ("Thirst", "Ludzu", 7, None), ("To cook", "Kuphika", 7, None),
  ("To rest", "Kupumula", 7, None), ("House", "Nyumba", 7, None),
 ],
 "Travel & Market": [
  ("Where is the bus / taxi going?", "Kodi basi/taksi ipita kuti?", 4, None), ("How far?", "Kodi ndi kutali bwanji?", 4, None),
  ("When is it leaving?", "Ipita liti?", 4, None), ("Give me change", "Ndipatseni cenji", 5, None),
  ("I want to buy oranges", "Ndifuna kugula malalanje", 5, None), ("I want to buy bananas", "Ndifuna kugula nthoci", 5, None),
  ("Where?", "Kuti?", 7, None), ("Work", "Nchito", 6, None),
 ],
 "Talking About Talking": [
  ("I don't speak Nyanja well", "Sindilankhula bwino cinyanja", 5, None),
  ("But I am trying to learn", "Koma ndiyesa kuphunzira", 5, None),
  ("I am sorry, I don't understand", "Pepani sindimvera", 5, None),
  ("How do you say...?", "Mukamba bwanji", 5, None), ("Did you understand me?", "Kodi munandimvetsa?", 5, None),
  ("Did I pronounce it correctly?", "Kodi ndinanena bwino?", 5, None), ("Learn", "Phunzira", 6, None),
  ("Again", "Bwerezanso", 6, None), ("Slowly", "Pang'ono pang'ono", 6, None), ("A little", "Pang'ono", 6, None),
  ("Why?", "Cifukwa", 6, None),
 ],
}

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

items, categories = [], []
for lvl, cats in PHRASES.items():
    for cat, phrases in cats.items():
        categories.append({"id": f"l{lvl}-{slug(cat)}", "track": "curriculum", "level": lvl, "name": cat})
        for i, en in enumerate(phrases, 1):
            t = T.pop((lvl, cat, en), None)
            it = {"id": f"l{lvl}-{slug(cat)}-{i:02d}", "category": f"l{lvl}-{slug(cat)}", "level": lvl,
                  "english": en, "nyanja": None, "status": "pending"}
            if t:
                it["nyanja"] = t["nyanja"]; it["status"] = t.get("status", "verified")
                it["source"] = {"doc": SRC, "page": t["page"]}
                for k in ("sourceEnglish", "note"):
                    if k in t: it[k] = t[k]
            items.append(it)
assert not T, f"unmatched translations: {list(T)}"

for cat, rows in KIT.items():
    cid = f"kit-{slug(cat)}"
    categories.append({"id": cid, "track": "kit", "level": 0, "name": cat})
    for i, (en, ny, page, extra) in enumerate(rows, 1):
        it = {"id": f"{cid}-{i:02d}", "category": cid, "level": 0, "english": en, "nyanja": ny,
              "status": "verified", "source": {"doc": SRC, "page": page}}
        if extra and extra.startswith("review:"):
            it["status"] = "review"; it["note"] = extra[7:]
        items.append(it)

out = {"levels": [{"level": k, "name": v[0], "title": v[1]} for k, v in LEVELS.items()],
       "categories": categories, "items": items}
p = pathlib.Path(__file__).resolve().parent.parent / "data" / "vocab.json"
p.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
from collections import Counter
print(p, Counter(i["status"] for i in items))
