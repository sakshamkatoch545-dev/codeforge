import enum

class LanguageEnum(str, enum.Enum):
    PYTHON = "python"

lang = LanguageEnum.PYTHON
driver_code = {"python": "import sys"}

print("lang in driver_code:", lang in driver_code)
