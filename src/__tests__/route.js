const app = require('../index');
const db = require('../utils/db');
var request = require('supertest');
var supertest = require('supertest');
//const jest = require('jest');
//const {request} = jest;

let token;

beforeAll((done) => {
  request(app)
    .post('/api/auth/signin')
    .send({
      username: "pcadler4",
      password: "mtwhitney",
    })
    .end((err, response) => {
      console.log(response.body);
      token = response.body.jwt || ""; // save the token!
      done();
    });
});

test("GET /api/group", async () => {
    //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });
  
    await supertest(app).get("/api/group")
    .set("Authorization", token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        //expect(response.body.length).toEqual(1);
  
        // Check data
        expect(response.body[0].id).toBe(post.id);
        expect(response.body[0].title).toBe(post.title);
        expect(response.body[0].content).toBe(post.content);
        expect(response.body)///
      });
  });
  

/*beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());
  });*/
  
  /* 
  

In Jest, these are done using four different functions:

    beforeAll - called once before all tests.
    beforeEach - called before each of these tests (before every test function).
    afterEach - called after each of these tests (after every test function).
    afterAll - called once after all tests.

*/