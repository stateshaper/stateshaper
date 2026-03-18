# *Stateshaper*

***Reduce the size of ML Training datasets by over 90%***

<br>

*Stateshaper* can significantly lower database costs associated with storage, bandwidth and energy consumption.

This type of data may need to be saved for uses including research, compliance, version control and documentation. 

Often times, this can lead to a large amount of storage space being consumed. 

Using *Stateshaper* in combination with a custom plugin ruleset can allow for test cases to be created and reproduced, without loss, from seed parameters using only a few bytes of total size.

The plugin ruleset can vary in complexity and is the only heavy-lifting needed to implement this program for ML Training scenarios. In many situations, the file can consist of only a few functions. If the data involves detailed requirements, the plugin and corresponding output can still be adjusted to fit this type of use. 

<br> 

For plugin file requirements, see the [`PLUGIN README`](PLUGINS.md)

<br> <br>

Here is an example web application showing how *Stateshaper* can be used in test runs to train the AI in self-driving cars:

https://stateshaper-ml-demo.vercel.app

<br>

The corresponding files associated with this demo can be found in the *src/main/demos* directory, or through this shortcut:

[`SELF-DRIVING CAR DEMO`](src/main/demos/self_driving)




<br> 




---

<br> 

## Project Structure

```text
stateshaper/
├── api/
|     ├── run_api.py
|     ├── API.md
├── docs/
|     ├── flowchart.png
├── src/
│   └── main/
|        └── connector/
|              ├── Connector.py
|              ├── Modify.py
|              ├── Vocab.py
|              ├── CONNECTOR.md
|        └── demos/
|              └── ml_training/
|                    └── data/
|                       ├── environments.py
|                       ├── vehicles.py
|                    ├── BuildEnvironment.py
|                    ├── MachineLearning.py
|                    ├── TripTimeline.py
|              ├── DEMOS.md
|        └── tools/
|              └── derive_vocab/
|                 ├── DeriveVocab.py
|                 ├── DERIVE_VOCAB.md
|              └── tiny_state/
|                 ├── TinyState.py
|                 ├── TINY_STATE.md
|              ├── TOOLS.md              
│       ├── core.py
│       ├── stateshaper.py
├── CHANGELOG.md
├── LICENSE
├── QUICK_START.md
├── pyproject.toml
├── QUICK_START.md
├── README.md
├── setup.py
```

---

<br> 

## License

This project is released under the MIT License. See [`LICENSE`](LICENSE) for details.

If you use this in research, products, or experiments, a mention or citation of the
"Stateshaper" and/or "Jason G. Dunn" is appreciated.
