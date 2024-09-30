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
    static coordinate(coordString: String): Coordinate {
        const [row, col] = coordString.split(",").map(Number);
        return new Coordinate(row, col);
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
    private _selectedSyllables : Set<String>; // 0..2
    private _swaps : Swap[]; // 0..*

    constructor(syllables:Map<String,String>,words:Map<String,String>, numWords:number, numSyllables:number) {
        this._syllables = syllables;
        this.words = words;
        this.numWords = numWords;
        this.numSyllablesInWord = numSyllables;
        this._selectedSyllables = new Set<String>();
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

        for (let gameRow = 0; gameRow < this.numWords; gameRow++) {    
            for (let solnRow = 0; solnRow < this.numWords; solnRow++) {
                let consecutiveScore = this.getConsecutiveMatchCount(gameRow, solnRow);
                score += consecutiveScore;
            }
        }

        return score;
    }

    switchSyllables(coord1:String, coord2:String) {
        var syl1 = this.syllables.get(coord1)
        var syl2 = this.syllables.get(coord2)

        this.syllables.set(coord1, syl2!)
        this.syllables.set(coord2, syl1!)
    }

    get syllables() : Map<String,String> {
        return this._syllables;
    }

    get swaps() : Swap[] {
        return this._swaps;
    }
    get selectedSyllables() : Set<String> {
        return this._selectedSyllables;
    }
}

export class Model {
    puzzle!: Puzzle;
    configuration: string

    // info is going to be JSON-encoded puzzle
    constructor(info: any) {
        this.configuration = ""
        this.initialize(info);
    }

    initialize(info: { name:string,board: String[][], solution : String[][]}) {
        this.configuration = info.name;
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

    canSwap():boolean {
        return this.puzzle.selectedSyllables.size === 2
    }

    canUndo() :boolean {
        return this.puzzle.swaps.length > 0;
    }
}