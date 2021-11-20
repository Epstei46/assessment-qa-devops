const {shuffleArray} = require('./utils')
const {bots} = require("./data.js")

describe('shuffleArray should', () => {
    /* the function and instructions are labeled incorrectly. (typeof bots) returns "object". This is because data.js contains the objects bots, which is not an array. So the function shuffleArray from ./utils.js is actually shuffling an object */
    test("return an object", () => {
        expect(typeof shuffleArray(bots)).toBe("object")
    })
    test("--with a parameter of bots--have a length equal to bots.length", () => {
        expect(shuffleArray(bots).length).toEqual(bots.length)
    })
    test("return a shuffled array that does not match the original array", () => {for(let i=0; i<25; i++){
        expect(shuffleArray(bots)).not.toBe(bots)
    }})
})