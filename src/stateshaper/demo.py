
import json
from tools.derive_vocab.DeriveVocab import DeriveVocab
from stateshaper import Stateshaper
from tools.tiny_state.TinyState import TinyState


class Demo:


    def __init__(self, user_id=None, **kwargs):
        super().__init__(**kwargs)


        # self.connector = None

        self.run_test("random")
        # DeriveVocab()
        # print(Functions().groups("pizza", "example_data/compound.json"))



    def run_test(self, test="compound"):
        file = self.get_file(test)

        with open(file, "r") as f:
            self.data = json.loads(f.read())
            f.close()

        self.engine = Stateshaper(self.data, token_count=50, initial_state=1)
        self.engine.start_engine()
        self.engine.run_engine()


    def get_file(self, test):
        return f"example_data/{test}.json"



Demo()