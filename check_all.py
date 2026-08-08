import sys
import types
import json

sys.modules['sqlalchemy'] = types.ModuleType('sqlalchemy')
sys.modules['sqlalchemy.orm'] = types.ModuleType('sqlalchemy.orm')
sys.modules['app'] = types.ModuleType('app')
sys.modules['app.models'] = types.ModuleType('app.models')
sys.modules['app.models.problem'] = types.ModuleType('app.models.problem')
sys.modules['app.models.problem'].DifficultyEnum = type('DifficultyEnum', (), {'EASY': 'EASY', 'MEDIUM': 'MEDIUM', 'HARD': 'HARD'})
sys.modules['app.models.problem'].Problem = type('Problem', (), {})
sys.modules['app.models.testcase'] = types.ModuleType('app.models.testcase')
sys.modules['app.models.testcase'].TestCase = type('TestCase', (), {})
sys.modules['app.models.user'] = types.ModuleType('app.models.user')
sys.modules['app.models.user'].User = type('User', (), {})
sys.modules['app.core'] = types.ModuleType('app.core')
sys.modules['app.core.security'] = types.ModuleType('app.core.security')
sys.modules['app.core.security'].get_password_hash = lambda x: x

sys.modules['sqlalchemy'].create_engine = lambda x: x
sys.modules['sqlalchemy'].text = lambda x: x
sys.modules['sqlalchemy.orm'].sessionmaker = lambda **kwargs: lambda: None

import scripts.seed_db as seed_db

for p in seed_db.PROBLEMS_DATA:
    print(f"================ {p['title']} ================")
    print("Test Cases:")
    for tc in p.get('test_cases', []):
        print(f"IN: {repr(tc['input'])}")
    print("Driver Code:")
    print(p.get('driver_code', {}).get('python', ''))
    print("\n")
