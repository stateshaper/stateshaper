# *DERIVE VOCAB


Taking an initial JSON string that uses a score to determine preference, the output for *Stateshaper* is returned. These scores are stripped from the data, and the rest is stored in the plugin file. 

When this data needs to be altered, conditional parameters are passed that re-define the output. 

Input JSON with Ratings --> Build Vocab List --> Remove Ratings from JSON Data, Save in Plugin File --> Alter Vocab Based on Conditions --> Rebuild Vocab List 


*Basic Use*

Call **'initial_rankings'** function, passing the correct dataset that includes preference ratings. The preference order is returned.
```python
rankings = initial_rankings(input_dataset)
```


*Altering Rankings - REQUIRED FORMAT*

When activity relating to the data occurs in the app, a response string can be built that adjusts the preference ratings for that data. This occurs within an app, and can be sent back to the *DeriveVocab* class and used to get a new set of vocab terms. The following shows a json object with each vocab as a key. 
```python
# True for strategy game indicates that the item will have a LOWER preference in the next vocab
# False means it will have a HIGHER preference in the next round
# None means to remove the item from the list of possible terms completely
from_app = {"strategy_game": True, "vertical_jump": False, "endurance_run": None}
```

This can be used in the *DeriveVocab* class function **'adjust_rankings'**. It is passed as a parameter, along with the original dataset (does not need the original ratings). The new vocab is returned.
```python
vocab = adjust_rankings(from_app, original_data)
```


# Initial Data Example
```python
    {
        "input": [
            {"strength_training": {"rating": 78, "data": {"item": "kettlebell_lift.png", "attributes": ["power_exercise","conditioning_workout"]}}},
            {"endurance_run": {"rating": 82, "data": {"item": "trail_run.png", "attributes": ["stamina_build","marathon_training"]}}},
            {"sprint_speed": {"rating": 74, "data": {"item": "sprint_track.png", "attributes": ["timing_practice","agility_course"]}}},
            {"agility_course": {"rating": 69, "data": {"item": "obstacle_course.png", "attributes": ["coordination_drill","mobility_drill"]}}},
            {"balance_challenge": {"rating": 63, "data": {"item": "tightrope.png", "attributes": ["control_drill","flexibility_session"]}}},
            {"coordination_drill": {"rating": 66, "data": {"item": "drumming.png", "attributes": ["rhythm_training","timing_practice"]}}},
            {"reaction_test": {"rating": 71, "data": {"item": "ping_pong.png", "attributes": ["coordination_drill","focus_practice"]}}},
            {"precision_training": {"rating": 75, "data": {"item": "sniper_training.png", "attributes": ["focus_practice","strategy_game"]}}},
            {"strategy_game": {"rating": 68, "data": {"item": "war_sim.png", "attributes": ["precision_training","teamwork_drill"]}}},
            {"teamwork_drill": {"rating": 76, "data": {"item": "relay_race.png", "attributes": ["stamina_build","leadership_task"]}}},
            {"leadership_task": {"rating": 70, "data": {"item": "team_coaching.png", "attributes": ["teamwork_drill","strategy_game"]}}},
        ],
        "rules": "derive",
        "length": 5
    }
```


# After Derived Vocab
```python
    {
        "input": [
        {"strength_training": "data": {"item": "kettlebell_lift.png", "attributes": ["strength_training","power_exercise","conditioning_workout"]}},
        {"endurance_run": "data": {"item": "trail_run.png", "attributes": ["endurance_run","stamina_build","marathon_training"]}},
        {"sprint_speed": "data": {"item": "sprint_track.png", "attributes": ["sprint_speed","timing_practice","agility_course"]}},
        {"agility_course": "data": {"item": "obstacle_course.png", "attributes": ["agility_course","coordination_drill","mobility_drill"]}},
        {"balance_challenge": "data": {"item": "tightrope.png", "attributes": ["balance_challenge","control_drill","flexibility_session"]}},
        {"coordination_drill": "data": {"item": "drumming.png", "attributes": ["coordination_drill","rhythm_training","timing_practice"]}},
        {"reaction_test": "data": {"item": "ping_pong.png", "attributes": ["reaction_test","coordination_drill","focus_practice"]}},
        {"precision_training": "data": {"item": "sniper_training.png", "attributes": ["precision_training","focus_practice","strategy_game"]}},
        {"strategy_game": "data": {"item": "war_sim.png", "attributes": ["strategy_game","precision_training","teamwork_drill"]}},
        {"teamwork_drill": "data": {"item": "relay_race.png", "attributes": ["teamwork_drill","stamina_build","leadership_task"]}},
        {"leadership_task": "data": {"item": "team_coaching.png", "attributes": ["leadership_task","teamwork_drill","strategy_game"]}}
        ],
        "rules": "derive",
        "length": 5
    }
```