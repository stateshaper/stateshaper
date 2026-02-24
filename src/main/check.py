

import sys


existing_maps = []
map_values = []


def check_map(new_map):
    # print("\n\nScanning created map for matches.")
    # for map in new_map:
    #     if map[1] in map_values:
    #         pass
    #         # print("\nMap already exists.")
    #     else:
    #         existing_maps.append(map)
    #         map_values.append(map[1])
    #         # print(f"\nMap {str(new_map.index(map) + 1)} is unique and has been added to the list.")
    # print("\n\nScan Completed.")
    # print(f"\n{round((len(existing_maps)/len(new_map)) * 100, 2)}% of maps (out of {str(len(new_map))}) are unique for current mapset.")

    with open("newfile2.txt", "w", encoding="utf-8") as f:
        f.write(str(new_map))
        f.close()