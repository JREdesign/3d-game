const mongoose = require('mongoose');
const { QuestionModel } = require('../../src/models/Questions');

// Conexión a una nueva base de datos en memoria para pruebas
beforeAll(async () => {
  const uri = 'mongodb://localhost:27017/tests';
  await mongoose.connect(uri);
});

// Limpiar los datos después de cada test
afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

// Desconectar de la base de datos después de todos los tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('QuestionModel', () => {
  it('should be defined', () => {
    expect(QuestionModel).toBeDefined();
  });

  it('can create a question with options', async () => {
    const questionData = {
      text: 'What is the capital of France?',
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'London', isCorrect: false },
        { text: 'Madrid', isCorrect: false }
      ],
      level: 1
    };

    const question = new QuestionModel(questionData);
    await question.save();

    const foundQuestion = await QuestionModel.findOne({ text: 'What is the capital of France?' });
    expect(foundQuestion).toBeDefined();
    expect(foundQuestion.text).toBe(questionData.text);
    expect(foundQuestion.options.length).toBe(3);
    expect(foundQuestion.level).toBe(questionData.level);
  });
});
