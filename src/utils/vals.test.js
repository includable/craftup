const { populateValue } = require("./vals");

process.env.SOMETHING = "value1";

describe("Value population", () => {
  test("Simple $SOMETHING value", () => {
    expect(populateValue("$SOMETHING")).toEqual("value1");
  });

  test("Invalid $SOMETHING value", () => {
    expect(populateValue("$SOMETHING ")).toEqual("$SOMETHING ");
  });

  test("Non existing $SOMETHING_ELSE", () => {
    expect(populateValue("$SOMETHING_ELSE")).toEqual("$SOMETHING_ELSE");
  });

  test("Simple $SOMETHING value", () => {
    expect(populateValue("$SOMETHING")).toEqual("value1");
  });

  test("Advanced ${SOMETHING}-value", () => {
    expect(populateValue("${SOMETHING}-value")).toEqual("value1-value");
  });
});
