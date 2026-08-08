import json
import enum
class LanguageEnum(str, enum.Enum):
    PYTHON = "python"

lang = LanguageEnum.PYTHON
driver_code = json.loads('{"python": "hello"}')
print(lang in driver_code)
print(driver_code.get(lang))
