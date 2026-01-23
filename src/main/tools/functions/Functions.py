import json


class Functions:

    def __init__(self, data=None, **kwargs):

        self.data = data 
    

    def set_data(self, data):
        self.data = data 


    def parent_key(self, item): 
        return next(iter(item))


    def attributes(self, item, data=None):
        data = self.data if not data else data
        return [list(i.values())[0]["data"]["attributes"] for i in data["input"] if self.parent_key(i) == self.parent_key(item)][0]
    

    def item(self, item, data=None):
        data = self.data if not data else data
        try: 
            item = [list(i.values())[0]["data"]["item"] for i in data["input"] if self.parent_key(i) == item][0]
        except: 
            item = [list(i.values())[0]["data"][0]["item"] for i in data["input"] if self.parent_key(i) == item][0]
        return item
    

    def rating(self, item, data=None):
        data = self.data if not data else data
        return [list(i.values())[0]["rating"] for i in data["input"] if self.parent_key(i) == self.parent_key(item)][0]


    def groups(self, item, data=None):
        data = self.data if not data else data
        return [i["groups"] for i in data if i["data"] == item][0]
    

    def get_file(self, path):
        with open(path, "r") as f:
            data = json.loads(f.read())
            f.close()
        return data