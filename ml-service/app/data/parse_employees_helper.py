import json
import os
import csv
import io

DATA_DIR = os.path.dirname(__file__)

# Common Designation to Cadre map
def map_cadre(desig, dept):
    if "Field" in dept or "NSSO" in dept:
        return "Field Operations Division (FOD)"
    if "Data" in dept or "DIID" in dept:
        return "Data Informatics & Innovation Division (DIID)"
    if "Price" in dept:
        return "Price Statistics Division (PSD)"
    if "Accounts" in dept:
        return "National Accounts Division (NAD)"
    if "State DES" in dept:
        return "State DES Cadre"
    if "Junior" in desig or "JSO" in desig or "Senior" in desig or "SSO" in desig:
        return "Subordinate Statistical Service (SSS)"
    return "Indian Statistical Service (ISS)"

print("Dataset helper ready.")
