# *Stateshaper*

<br> 

***Reduce file size and generate content using small seeds***


*Stateshaper* is a Python project that assists in tokenizing an infinite array of memorized numbers. The tokens can be re-created from only a few bytes and used with mapping rules that can call events or derive values for variables. Determinism is achieved by implementing an algorithm that shares similarites with PRNGs (Pseudo-random Number Generator) and LCGs (Linear Congruential Generator). 

The primary benefit of the package is that it allows for a reduction in the storage size of many types of datasets. This in turn saves database costs, including those related to size, bandwidth and energy. This can amount to a savings of over 90% in many cases. It is most efficient when used for programs featuring content generation, personalization, synthetic data and procedural generation. 

*Stateshaper* can also be used securely. If desired, the output created from the starting seed can be unique based on the chosen parameters. For example, in web applications the parameter values can be stored in environment variables the same way that access keys can.


<br> <br> 

Recommended Uses Include:

- Content Generation
- ML Training
- Personalized Suggestions
- QA Stress Testing
- Procedural World Generation

<br>

Examples:

- Targeted Ads
- News for You
- Movie/Music Suggestions
- Evolving Study Plans
- Personalized Tests
- Fitness Routine
- Meal Planner
- Document/Record Compliance
- Application Stress Testing
- UUID Generator
- ML Training
- Cryptography
- Data Simulations
- Procedural Graphics and Lore
- NPC Behavior
  


<br> <br> 

This repository contains code written in Python, with other langauges scheduled to be available soon. 

Multiple demonstrations are currently live online (currently desktop only):

<br> <br>

*ML Training Demo*

https://stateshaper-ml.vercel.app

<h6>Ruleset: <i>Tokens</i></h6>

ML Training can require an enourmous amount of data. *Stateshaper* is able to create nearly all possible test scenarios and re-create them at any time. This only takes a basic plugin file that derives values from tokenized numeric output. This demo shows how *Stateshaper* can be used in ML Training for self-driving cars.

<br> <br>

*Targeted Ads Compression Demo*

https://ads-demo.vercel.app

<h6>Ruleset: <i>Ratings</i></h6>

Demonstrates the engine's ability to generate data based on personalization. Ads shown are based on user preference ratings and can be adjust in the app. The data needed to recreate the entire profile is condensed into a ~50-250 byte JSON string. 

<br> <br>

*Lesson Plans Demo*

https://lessons-demo.vercel.app

<h6>Ruleset: <i>Ratings</i></h6>

An example of a personalized learning plan based on a student's performance. Condenses the entire profile into a small seed. 

<br> <br>

*Fintech QA Demo*

https://stateshaper-qa-demo.vercel.app

<h6>Ruleset: <i>Tokens</i></h6>

Using numbers as tokens, values are derived to stress test a fintech app's math calculations.

<br> <br>

*Drawing Graphics Demo*

https://stateshaper-drawing.vercel.app

<h6>Ruleset: <i>Tokens</i></h6>

With a plugin file that uses a numerical token to set each graphic object's attributes, an endless amount of onscreen content can be generated. A basic example of 2d shapes and colors is shown. When more precise calculations are used, this output can include even the most modern textures. 

<br> <br>

---

<br> <br> 

## Quick Start

<br> 

Clone this repository:

```bash
git clone https://github.com/stateshaper/stateshaper.git
cd stateshaper
```

**Make sure your data is in one of the formats listed in the *"example_data"* directory. The output that is generated depends on the values contained in this dataset. The data types are based on the following rules:**

Instructions: [`Formatting Data for Input`](example_data/format_data/FORMAT_DATA.md)

<h6><i>If needed, use the FormatData class in the nested 'format_data' directory.</i></h6>

<br> <br>

**Initialize a *RunEngine* class:**

```python
# data (REQUIRED) - the input data. must be in a format listed in the 'example_data' directory
# seed (optional) - only required to recreate a previous run of the engine. it is created after the first run of the engine. when used, no other parameters other than token count need to be specified. if no custom parameters are set, only the "v" key with state format data needs to be included. (ex. seed={"v": ["ABC12345", "BVCH457SZ"]})
# token_count (optional, default=10) - The desired size of the list containing your input terms.
# initial_state (optional, default=5) - The starting number to derive your output from. It can also be an array of integers for custom logic. 
# constants (optional, default={"a": 3, "b": 5, "c": 7, "d": 11}) - Only change this for custom morphing equations.
# mod (optional, default=9973) - Only change this for custom morphing equations. Its size indicates how much unique data can be generated from a seed. This can scale from 1 to infinity (or whatever the largest number the computer can handle is).

from stateshaper import RunEngine

# BASIC (first run)
engine = RunEngine(data=your_data, token_count=needed_tokens)

# RE-CREATE PREVIOUS OUTPUT
engine = RunEngine(data=your_data, seed=created_seed, token_count=needed_tokens)

# CUSTOM
engine = RunEngine(data=your_data, seed=created_seed, token_count=needed_tokens, constants=optional_custom_logic, mod=more_optional_logic)

#FULLY DEFINED 
engine = RunEngine(data=your_data, token_count=needed_tokens, initial_state=optional_int_or_int_list, constants=optional_custom_logic, mod=more_optional_logic)


engine.start_engine()
```

<br> 

**Call the *run_engine* method:**

```python
engine.run_engine() # can pass an integer as a token count if a certain amount of output is needed. ex: engine.run_engine(25)

# OUTPUT    
#
# ["your", "input", "values", "are", "returned", "based", "on", "chosen", "stateshaper", "rules"]


# FOR ONE TOKEN
engine.one_token()

# OUTPUT
#
# ["one_item"]


# PREVIOUS TOKENS (based on passed token count)
engine.reverse()

# OUTPUT    
#
# ["rules", "stateshaper", "chosen", "on", "based", "returned", "are", "values", "input", "your"]


# REVERSE ONE
engine.one_reverse()

# OUTPUT
#
# ["one_item"]
```

<br> <br>

For continuous use, the engine can be called in a loop using the *run_engine* function. For one time, call it once with a specific *token_count* parameter.

To create the same output again, *start_engine* needs to be called once more.

<br> <br> 

---

<br> <br>

## Connector Class

<br> 

The *Connector* class can take your data and process it to be ready for compression into seed format.  

For more info, see the [`CONNECTOR`](src/main/connector/CONNECTOR.md) documentation.  


<br> 

---

<br> <br>

## TinyState Class

<br> 

Relevant data for applications featuring personalization can be stored in *Tiny State* and/or *Raw State* format. This format is needed in addition to the regular parameters because it is intended to decode user-specific data subsets. The subsets can be selected from a larger dataset featured within a plugin file. 

For more info, see the [`TINY_STATE`](src/main/tools/tiny_state/TINY_STATE.md) documentation.

<br> 

---

<br> <br>

## Project Structure

<br> 

```text
stateshaper/
├── api/
|     ├── run_api.py
|     ├── API.md
├── example_data
|     └── format_data/
|        ├── FormatData.py
|        ├── FORMAT_DATA.md
|     ├── compound.json
|     ├── random.json
|     ├── rating_derived.json
|     ├── rating_initial.json
|     ├── tokens.json
|     ├── EXAMPLE_DATA.md
├── research/
|     ├── flowchart.png
├── src/
│   └── main/
|        └── connector/
|              ├── Connector.py
|              ├── Modify.py
|              ├── Vocab.py
|              ├── CONNECTOR.md
|        └── demos/
|              └── ads/
|                    ├── ad_list.py
|                    ├── Ads.py
|              └── fintech_qa/
|                    ├── FintechQA.py
|                    ├── qa_data.py
|                    ├── FINTECH_QA.md
|              └── graphics/
|                    ├── Graphics.py
|                    ├── GRAPHICS.md
|              └── lesson_plan/
|                    ├── lessons_list.py
|                    ├── LessonPlan.py
|              └── ml_training/
|                    └── data/
|                       ├── environments.py
|                       ├── vehicles.py
|                    ├── BuildEnvironment.py
|                    ├── MachineLearning.py
|                    ├── TripTimeline.py
|              ├── DEMOS.md
|        └── tools/
|              └── compress_json/
|                 ├── CompressJson.py
|              └── derive_vocab/
|                 ├── DeriveVocab.py
|                 ├── derive_vocab.png
|                 ├── DERIVE_VOCAB.md
|              └── tiny_state/
|                 ├── TinyState.py
|                 ├── TINY_STATE.md
|              ├── TOOLS.md              
│       ├── core.py
│       ├── stateshaper.py
├── QUICK_START.md
├── README.md



```

<br> <br>
