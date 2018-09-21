/* eslint-disable */

const {Thuoc} = require('../src/app/Model/Thuoc');

test("Thuoc Construct", () => {
    expect(() => {
        const thuoc = new Thuoc();
    }).not.toThrow();
});

test("Thuoc db url", () => {
    const thuoc = new Thuoc();
    expect(thuoc.database).toEqual("/api/thuoc/");
});
