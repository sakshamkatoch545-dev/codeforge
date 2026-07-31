from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TestCase(Base):
    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problem.id"), nullable=False)
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    is_hidden = Column(Boolean, default=False)
    
    # Relationships
    problem = relationship("Problem", back_populates="test_cases")
