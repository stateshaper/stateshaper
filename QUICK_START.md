# *QUICK START GUIDE*


```python 
from stateshaper-ml import Stateshaper

# initialize the package
# use a custom initial state to create a variation in output
stateshaper = Stateshaper(state=123)

# start the engine to prepare it for output
stateshaper.start_engine()

# the custom class pertaining to the ml training scenario
ml = MachineLearning()

# create 50 tokens to derive data from
tokens = stateshaper.run_engine(token_count=50)

# create 50 sets of ml training data
data = [ml.current_test(token) for token in tokens]


# to re-create the data
stateshaper.rebuild()
```