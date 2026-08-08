import ast
import json
import os
import sys

# Connect to psycopg2 or just parse seed_db?
# Actually let's just query the API! The backend is running on http://localhost:8000
import urllib.request

def fetch_problems():
    req = urllib.request.Request('http://localhost:8000/api/v1/problems/')
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def validate():
    problems = fetch_problems()
    errors = []
    
    for p in problems:
        title = p['title']
        sc = p.get('starter_code', {})
        if isinstance(sc, str):
            try:
                sc = json.loads(sc)
            except:
                pass
                
        # Check Python
        if 'python' in sc:
            code = sc['python']
            try:
                ast.parse(code)
            except SyntaxError as e:
                errors.append(f"Syntax error in Python starter code for '{title}': {e}")
        
        # Check for missing brackets in Java or JS
        for lang in ['java', 'javascript', 'cpp']:
            if lang in sc:
                code = sc[lang]
                if code.count('{') != code.count('}'):
                    errors.append(f"Unmatched braces in {lang} starter code for '{title}'")
                if code.count('(') != code.count(')'):
                    errors.append(f"Unmatched parentheses in {lang} starter code for '{title}'")

    if not errors:
        print("No errors found in starter codes.")
    else:
        print("Errors found:")
        for e in errors:
            print("-", e)

if __name__ == '__main__':
    validate()
