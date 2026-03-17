# *Stateshaper*

***Often reduces the size of ML Training datasets by over 90%***

<br>

*Stateshaper* can significantly lower database costs associated with storage, bandwidth and energy consumption.

This type of data may need to be saved for uses including research, compliance, version control and documentation. 

Often times, this can lead to a large amount of storage space being consumed. 

Using *Stateshaper* in combination with a custom plugin ruleset can allow for test cases to be created and reproduced, without loss, from seed parameters using only a few bytes of total size.

The plugin ruleset can vary in complexity and is the only heavy-lifting needed to implement this program for ML Training scenarios. In many situations, the file can consist of only a few fuctions. If the data involves detailed requirements, the plugin and corresponding output can still be adjusted to fit this type of use. 

<br> 

For plugin file requirements, see the Plugin README:

https://github.com/stateshaper/stateshaper/tree/ml_use/PLUGINS.md

<br> <br>

# *QUICK START GUIDE*

From Terminal:
```cmd
> pip install stateshaper-ml
```
<br>

In Codebase:
```python 
from stateshaper_ml import Stateshaper

# initialize the package
# use a custom initial state to create a variation in output
stateshaper = Stateshaper(initial_state=123)

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
<br>

### *Optional*
Custom parameters can be passed into the *Stateshaper* class if security or tailored variation is desired. 

1. The output can't be duplicated unless its matching parameters are passed. 
2. Altering the parameters will change the equation.
 

- **initial_state**, *integer* - An integer to determine where the token sequence starts from. 
- **constants**, *list* - A list of integers used in calculations for synthetic data.
- **mod**, *integer* (PRIME REQUIRED) - A prime number that determines the max value of a particular token. Increase this to further approach infinity.

<br> <br>

# *LIVE DEMO*

Here is an example web application showing how *Stateshaper* can be used in test runs to train the AI in self-driving cars:

https://stateshaper-ml-demo.vercel.app

<br>

The corresponding files associated with this demo can be found in the *src/main/demos* directory, or through this shortcut:

https://github.com/stateshaper/stateshaper/tree/ml_use/src/main/demos/self_driving




<br> <br>


---

<br> 

## License

This project is released under the MIT License. See https://github.com/stateshaper/stateshaper/tree/ml_use/LICENSE for details.

If you use this in research, products, or experiments, a mention or citation of the
"Stateshaper" and/or "Jason G. Dunn" is appreciated.