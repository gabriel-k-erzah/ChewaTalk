# ChewaTalk

## Overview

ChewaTalk is a language-learning app designed to help users learn **Nyanja (Chichewa)** through short, structured and interactive lessons.

The aim is to make learning Nyanja accessible to beginners, particularly people who want practical vocabulary and phrases they can use in everyday conversations.

The app is currently being developed using **Base44**.

## Core Concept

ChewaTalk teaches users through categories of vocabulary and phrases.

Examples include:

- Greetings
- Family
- Food
- Numbers
- Colours
- Navigation and directions

Each category contains lessons ranging from **Level 1 to Level 5 difficulty**.

The difficulty should gradually increase from individual words and simple expressions to complete conversational phrases.

### Difficulty System

**Level 1 — Beginner**

Very simple words and common expressions.

Examples:

- Hello
- Mother
- Water
- Red
- One

**Level 2 — Basic**

Simple vocabulary and short sentences.

Examples:

- How are you?
- This is my mother
- I am hungry
- Turn left

**Level 3 — Intermediate**

Longer sentences and common conversational questions.

Examples:

- How many people are there?
- What do you want for dinner?
- How do I get to the market?

**Level 4 — Advanced**

More detailed sentences involving context, descriptions or instructions.

Examples:

- My father works in the city.
- Follow this road for five minutes.
- I want to try a local dish.

**Level 5 — Conversational**

Natural, more complex sentences that require a stronger understanding of Nyanja.

Examples:

- Please extend my greetings to your family.
- Do you know how to prepare this meal?
- I was told to meet someone near the roundabout. Do you know where that is?

## Lesson Structure

Each lesson should teach an English word or phrase and its corresponding Nyanja translation.

A lesson item should ideally contain:

- Category
- Difficulty level
- English phrase
- Nyanja translation
- Pronunciation/audio where available
- Explanation or context where necessary

For example:

Category: Greetings  
Level: 1  
English: Hello  
Nyanja: [Translation]  
Audio: [Pronunciation]

## Quiz System

Users should be tested on vocabulary they have learned.

A typical question could be:

**How do you say "Hello" in Nyanja?**

The user should select or enter the correct Nyanja translation.

Questions can include:

- English → Nyanja
- Nyanja → English
- Multiple choice
- Matching words
- Listening/pronunciation questions in the future

The quiz system should use vocabulary from the user's current level and previously completed levels.

## Progression

Users begin with easier Level 1 content and progressively unlock more difficult vocabulary.

The progression should follow:

Level 1 → Level 2 → Level 3 → Level 4 → Level 5

Users should be encouraged to complete lessons and quizzes before progressing.

The app should track:

- Lessons completed
- Categories completed
- Current level
- Correct answers
- Incorrect answers
- Quiz scores
- Learning streak
- Overall progress

## Vocabulary Categories

Initial categories are:

### Greetings

Everyday greetings, introductions and polite expressions.

### Family

Family members, relationships and conversations about family.

### Food

Common foods, meals, eating, cooking and food-related conversations.

### Numbers

Basic counting followed by numbers used naturally in conversations, money and time.

### Colours

Basic colours followed by descriptions of objects and more complex colour vocabulary.

### Navigation

Directions, locations, asking for help and travelling between places.

More categories can be introduced as ChewaTalk grows.

## User Experience

The app should feel:

- Simple
- Modern
- Friendly
- Accessible
- Beginner-focused
- Mobile-first

Avoid overwhelming users with large amounts of information at once.

Lessons should be short and encourage frequent practice.

The interface should clearly show the user's current category, level and progress.

## Data Structure

Vocabulary should be stored separately from the interface so that new words, translations and categories can easily be added without redesigning the application.

A vocabulary record could contain:

- `id`
- `category`
- `level`
- `english`
- `nyanja`
- `pronunciation`
- `audio`
- `example`
- `active`

Example:

```text
Category: Food
Level: 1
English: Rice
Nyanja: [Translation]
Pronunciation: [Optional]
Audio: [Optional]
```

## Translation Rules

Do not automatically invent Nyanja translations.

Translations should come from verified ChewaTalk vocabulary data or be reviewed before being published.

English phrases can be generated when expanding lessons, but the Nyanja translation should remain empty until it has been verified.

This is important because translations can vary depending on context, dialect and how people naturally speak.

## Long-Term Vision

ChewaTalk should grow from a vocabulary-learning application into a broader platform for learning Nyanja.

Future features could include:

- Native-speaker audio
- Pronunciation practice
- Speaking exercises
- Daily challenges
- Streaks
- XP and levels
- Achievements
- Flashcards
- Personal vocabulary revision
- Conversation exercises
- Additional lesson categories
- Cultural notes
- Offline lessons
- Community or native-speaker contributions

The core principle of ChewaTalk is:

**Start with simple, useful Nyanja and gradually move the learner towards real conversation.**
