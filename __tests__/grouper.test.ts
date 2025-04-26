import '@testing-library/jest-dom'
import Student from "../src/lib/dtos/Student";
import Score from "../src/lib/dtos/Score";
import Grouper from "../src/lib/Grouper";

describe('Grouper', () => {
    const testStudents = [
        new Student("Alice", "alice@alice.com", "sucks at math", [0.5, 0.3, 0.1, 0.9, 0.8], 1),
        new Student("Bob", "bob@bob.com", "good at coding", [0.7, 0.2, 0.4, 0.8, 0.6], 2), 
        new Student("Charlie", "charlie@charlie.com", "average student", [0.4, 0.4, 0.4, 0.5, 0.5], 3),
        new Student("David", "david@david.com", "strong in science", [0.9, 0.8, 0.7, 0.6, 0.9], 4),
        new Student("Eve", "eve@eve.com", "creative writer", [0.3, 0.9, 0.8, 0.4, 0.2], 5),
        new Student("Frank", "frank@frank.com", "history buff", [0.6, 0.6, 0.6, 0.7, 0.7], 6),
        new Student("Grace", "grace@grace.com", "art enthusiast", [0.2, 0.8, 0.9, 0.3, 0.4], 7),
        new Student("Henry", "henry@henry.com", "sports star", [0.8, 0.3, 0.2, 0.9, 0.7], 8),
        new Student("Ivy", "ivy@ivy.com", "debate champion", [0.7, 0.7, 0.8, 0.6, 0.8], 9),
        new Student("Jack", "jack@jack.com", "music prodigy", [0.4, 0.9, 0.7, 0.5, 0.3], 10)
    ];

    const testScores = [
        new Score([0.75, 0.0, 0.25, 0.5, 1.0], 1),
        new Score([0.60, 0.8, 0.45, 0.7, 0.9], 2),
        new Score([0.50, 0.5, 0.50, 0.5, 0.5], 3),
        new Score([0.95, 0.85, 0.75, 0.65, 0.85], 4),
        new Score([0.35, 0.95, 0.85, 0.45, 0.25], 5),
        new Score([0.65, 0.65, 0.65, 0.75, 0.75], 6),
        new Score([0.25, 0.85, 0.95, 0.35, 0.45], 7),
        new Score([0.85, 0.35, 0.25, 0.95, 0.75], 8),
        new Score([0.75, 0.75, 0.85, 0.65, 0.85], 9),
        new Score([0.45, 0.95, 0.75, 0.55, 0.35], 10)
    ];

    test('test test', () => {
        console.log(Grouper.create_groups(3, 0.7, 0.3, testScores, testStudents))

        expect(true).toBeTruthy();
    })
});