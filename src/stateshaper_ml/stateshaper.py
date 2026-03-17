import json
import random
import sys
from .connector.Connector import Connector
from .core import Core
from .tools.derive_vocab.DeriveVocab import DeriveVocab
from .tools.tiny_state.TinyState import TinyState

import os

# Get the directory of the current script, then go up one
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(base_dir, "example_data", "tokens.json")


class Stateshaper:

    def __init__(self, data=None, original_data=None, seed=None, token_count=10, initial_state=5, vocab=None, constants=[3, 5, 7, 11], mod=9973, **kwargs):
        

        if isinstance(data, dict):
            self.data = data 
        else:
            self.data = {
                "input": [],
                "rules": "tokens",
                "length": 1
            }

        self.original_data = original_data
        
        self.seed = None

        self.first_run = True if not seed else False

        self.token_count = token_count


        if isinstance(initial_state, int):
            initial_state = [initial_state]



        try:
            initial_state = seed["s"] 
        except:
            initial_state = initial_state 
        try:
            vocab = seed["v"]
        except:
            vocab = vocab
        try:
            constants = self.define_constants(constants)
        except:
            constants = {"a": constants[0], "b": constants[1], "c": constants[2], "d": constants[3]}
        try: 
            mod = seed["m"] 
        except: 
            mod = mod
    
        self.seed = {
            "state": initial_state,
            "vocab": vocab,
            "constants": constants,
            "mod": mod
        }

        self.connector = Connector(data=self.data, token_count=token_count, initial_state=initial_state,  constants=constants, vocab=vocab, mod=mod)

        self.tiny_state = TinyState()

        self.derive_vocab = DeriveVocab()

        self.engine = None

        self.default_seed = None

        self.derived_seed = None



    def define_constants(self, constants):
        constants_keys = ["a", "b", "c", "d"]
        default_constants = [3, 5, 7, 11]
        constants_values = {}

        for key in constants_keys:
            try:
                constants_values[key] = constants[constants_keys.index(key)]
            except:
                constants_values[key] = default_constants[constants_keys.index(key)]

        return constants_values



    def start_engine(self):
        self.engine = None
        self.seed = self.connector.start_connect()
        self.define_engine()


    def define_engine(self, state=None, vocab=None, constants=None, mod=None):
        self.engine = Core(
            self.seed["state"] if not state else state,
            self.seed["vocab"] if not vocab else vocab,
            self.seed["constants"] if not constants else constants,
            self.seed["mod"] if not mod else mod,
            [self.data["compound_length"], self.data["compound_groups"], self.data["compound_terms"]] if self.data["rules"] == "compound" else None
        )


    def run_engine(self, token_count=None):
        self.tokens = self.engine.generate_tokens(self.token_count if not token_count else token_count)
        print("\n\nTokens successfully generated from vocab.")
        print("============================================")
        print(self.tokens)

        return self.tokens
    

    def reverse(self, token_count=None):
        self.tokens = [self.engine.reverse() for _ in range(self.token_count if not token_count else token_count)]
        print("\n\nToken re-created from reverse.")
        print("============================================")
        print(self.tokens)

    
    def jump(self, index):
        self.tokens = self.engine.jump(index)
        print(f"\n\nToken successfully accessed from index {str(index)}.")
        print("============================================")
        print(self.tokens)


    def one_token(self):
        self.tokens = self.engine.step()
        print("\n\nOne token has been created.")
        print("============================================")
        print(self.tokens)
        return self.tokens 
    

    def reverse_one(self):
        self.tokens = self.engine.reverse() 
        print("\n\nOne token re-created from reverse.")
        print("============================================")
        print(self.tokens)
        return self.tokens


    def rebuild(self):
        self.engine.rebuild()


    def get_seed(self, state=None, vocab=False, constants=None, mod=None):
        return self.connector.output_seed(state=state, vocab=vocab, constants=constants, mod=mod)
    
    
    def get_derived(self):
        return self.derived_seed
    

    def adjust_ratings(self):
        for _ in range(20):
            self.derive_vocab.adjust_rankings(self.original_data, self.data)
        new_vocab = self.derive_vocab.current_vocab()
        self.seed["vocab"]  = new_vocab
        self.derived_seed = self.new_seed(new_vocab)
        self.define_engine()


    def new_seed(self, vocab):
        seed = {}

        seed["s"] = self.seed["state"]  
        seed["v"] = self.connector.compress_regular(vocab)
        seed["c"] = self.seed["constants"]
        seed["m"] = self.seed["mod"]

        self.derived_seed = seed["v"]  

        return seed