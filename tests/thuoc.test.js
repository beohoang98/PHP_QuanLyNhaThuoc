/* eslint-disable */

const {Thuoc} = require('../src/app/Model/Thuoc');

test("Thuoc Construct", () => {
    expect(() => {
        const thuoc = new Thuoc();
    }).not.toThrow();
});
