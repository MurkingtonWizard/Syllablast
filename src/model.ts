export class Coordinate {
    readonly row : number;
    readonly column : number;

    constructor(row:number, column:number) {
        this.row = row;
        this.column = column;
    }

    static key(row:number, column:number):String {
        return `${row},${column}`;
    }

    get key() :String {
        return Coordinate.key(this.row,this.column);
    }
}

export class Swap {
    readonly syllables : Coordinate[];

    constructor(firstSyl:Coordinate, secondSyl:Coordinate) {
        this.syllables = [firstSyl, secondSyl];
    }
}

export class Puzzle {
    private _syllables : Map<String,String>; // *
    private readonly words : Map<String,String>; // *
    readonly numWords : number;
    readonly numSyllablesInWord : number;
    private _selectedSyllables : Coordinate[]; // 0..2
    private _swaps : Swap[]; // 0..*

    constructor(syllables:Map<String,String>,words:Map<String,String>, numWords:number, numSyllables:number) {
        this._syllables = syllables;
        this.words = words;
        this.numWords = numWords;
        this.numSyllablesInWord = numSyllables;
        this._selectedSyllables = [];
        this._swaps = [];
    }

    private getConsecutiveMatchCount(syllableRow: number, wordsRow: number): number {
        let score = 0;

        for (let col = 0; col < this.numSyllablesInWord; col++) {
            if (this.syllables.get(Coordinate.key(syllableRow, col)) === 
                this.words.get(Coordinate.key(wordsRow, col))) {
                score++;
            } else {
                return score;
            }
        }

        return score;
    }

    calculateScore() {
        var score:number = 0;
        var rowsChecked = new Set<number>();

        for (let i = 0; i < this.numWords; i++) {
            let bestMatchRow: number = -1;
            let bestMatchScore = 0;
    
            for (let j = 0; j < this.numWords; j++) {
                if (!rowsChecked.has(j)) {
                    let consecutiveScore = this.getConsecutiveMatchCount(i, j);
    
                    if (consecutiveScore > bestMatchScore) {
                        bestMatchScore = consecutiveScore;
                        bestMatchRow = j;
                    }
                }
            }
    
            if (bestMatchRow != -1) {
                score += bestMatchScore;
                rowsChecked.add(bestMatchRow);
            }
        }

        return score;
    }

    get syllables() : Map<String,String> {
        return this._syllables;
    }

    get swaps() : Swap[] {
        return this._swaps;
    }
    get selectedSyllables() : Coordinate[] {
        return this._selectedSyllables;
    }
}

export class Model {
    puzzle!: Puzzle;

    // info is going to be JSON-encoded puzzle
    constructor(info: any) {
        this.initialize(info);
    }

    initialize(info: { board: String[][], solution : String[][]}) {
        let syllables = new Map<String, String>();
        let words = new Map<String, String>();
        for( var rowIndex in info.board) {
            for ( var colIndex in info.board[rowIndex]) {
                syllables.set(Coordinate.key(+rowIndex,+colIndex),info.board[rowIndex][colIndex]);
                words.set(Coordinate.key(+rowIndex,+colIndex),info.solution[rowIndex][colIndex]);
            }
        }
        this.puzzle = new Puzzle(syllables,words,info.solution.length, info.solution[0].length);
    }

    get numSwaps():number {
        return this.puzzle.swaps.length;
    }

    get score():number {
        return this.puzzle.calculateScore()
    }

    get victory():boolean {
        return this.score == this.puzzle.syllables.size;
    }
}