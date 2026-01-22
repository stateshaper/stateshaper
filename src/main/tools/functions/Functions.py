import json


class Functions:
    

    def parent_key(self, item): 
        return next(iter(item))


    def attributes(self, item, data):
        return [list(i.values())[0]["data"]["attributes"] for i in data["input"] if self.parent_key(i) == item][0]
    

    def item(self, item, data):
        return [list(i.values())[0]["data"]["item"] for i in data["input"] if self.parent_key(i) == item][0]


    def rating(self, item, data):
        return [list(i.values())[0]["rating"] for i in data["input"] if self.parent_key(i) == item][0]


    def groups(self, item, data):
        return [i["groups"] for i in data if i["data"] == item][0]
    

    def get_file(self, path):
        with open(path, "r") as f:
            data = json.loads(f.read())
            f.close()
        return data