/* 
* TILEBOARD
*/
class Tile {
  constructor(rowElement) {
    this._tileElement = document.createElement('div');
    this._tileElement.classList.add('tile');

    rowElement.appendChild(this._tileElement);
  }

  get text() {
    return this._tileElement.innerText;
  }
  set text(value) {
    this._tileElement.innerText = value;
  }
  get color() {
    return this._tileElement.style.backgroundColor;
  }
  set color(value) {
    this._tileElement.style.backgroundColor = value;
  }

  get isEmpty() {
    // return this._tileElement.innerText.length > 0;
    if (this._tileElement.innerText == "") {
      return true;
    }
    else {
      return false;
    }
  }
}
class TileboardRow {
  constructor(gridElement, numberOfTilesPerRow) {
    let rowElement = document.createElement('div');
    rowElement.classList.add('row');
    gridElement.appendChild(rowElement);

    this.tiles = [];

    for (var i = 0; i < numberOfTilesPerRow; i++) {
      const tile = new Tile(rowElement);
      tile.character = "";
      this.tiles.push(tile);
    }
  }

  get firstEmptyTile() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].isEmpty) {
        return this.tiles[i];
      }
    }
  }
}
class Tileboard {
  constructor(tileboardElement, numberofRows, numberOfTilesPerRow) {
    tileboardElement.classList.add('tileboard');
    this.tileBoardRows = [];

    for (let i = 0; i < numberofRows; i++) {
      const row = new TileboardRow(tileboardElement, numberOfTilesPerRow);
      this.tileBoardRows.push(row);
    }
  }

  setTileText(row, col, text) {
    this.tileBoardRows[row].tiles[col].text = text;
  }
  setTileColor(row, col, tileColor) {
    this.tileBoardRows[row].tiles[col].color = tileColor;
  }
}

/*
* KEYBOARD
*/
class Key {
  constructor(keyboardRowElement, character, keyPressed) {
    this._keyElement = document.createElement('div');
    this._keyElement.classList.add('key');
    this._keyElement.innerText = this.translateIntoVisualCharacter(character);

    keyboardRowElement.appendChild(this._keyElement);
    this._keyElement.onclick = function(e) {
      keyPressed(character);
    }
  }

  get color() {
    return this._keyElement.style.backgroundColor;
  }
  set color(value) {
    this._keyElement.style.backgroundColor = value;
  }

  translateIntoVisualCharacter(character) {
    if (character == Chars.backspace) {
      return "←";
    }
    else if (character == Chars.enter) {
      return "↵";
    }

    return character;
  }
}
class KeyboardRow {
  constructor(keyboardElement, characters, keyPressed) {
    let keyboardRowElement = document.createElement('div');
    keyboardRowElement.classList.add('keyboardRow');
    keyboardElement.appendChild(keyboardRowElement);

    this._keys = {};

    for (let character of characters) {
      this._keys[character] = new Key(keyboardRowElement, character, keyPressed);
    }
  }

  setKeyColor(keyLetter, color) {
    const key = this._keys[keyLetter];

    if (!key) {
      return;
    }

    this._keys[keyLetter].color = color;
  }
}
class Keyboard {
  constructor(keyboardElement, keyPressed) {
    const rowsOfLetters = [
      "QWERTYUIOP",
      "ASDFGHJKL",
      Chars.enter + "ZXCVBNM" + Chars.backspace
    ];

    this._keyboardRows = [];

    for (let i = 0; i < rowsOfLetters.length; i++) {
      let characters = rowsOfLetters[i].split("");
      this._keyboardRows[i] = new KeyboardRow(keyboardElement, characters, keyPressed);
    }
  }

  setKeyColor(keyLetter, color) {
    for (let keyboardRow of this._keyboardRows) {
      keyboardRow.setKeyColor(keyLetter, color);
    }
  }
}
class Char {
  #rawChar = "";

  constructor(rawChar) {
    this.#rawChar = rawChar;
  }

  get rawChar() {
    return this.#rawChar;
  }

  get isEnter() {
    return this.rawChar == Chars.enter;
  }

  get isBackspace() {
    return this.rawChar == Chars.backspace;
  }
}
const Chars = {
  enter: '\n',
  backspace: '\r',
  empty: ''
}

/*
* CORE MODEL
*/
class Attempt {
  constructor(nr, word) {
    this.nr = nr;
    this.word = word ?? "";
    this.evalLabels = [];
  }

  get isFull() {
    return this.word.length === 5;
  }
  get isEmpty() {
    return this.word.length === 0;
  }

  enterCharacter(char) {
    if (char.isBackspace) {
      if (this.isEmpty) {
        throw new Error("Row is empty");
      }

      this.deleteLastChar();
    }
    else if (char.isEnter) {
      if (this.isFull) {
        // handled on a higher abstractional level (GOF class)
        throw new Error("This shouldn't happen.");
      }
      else {
        throw new Error("Not enough letters");
      }
    }
    else {
      // TODO: check if attempt is full
      this.appendNewChar(char);
    }
  }
  appendNewChar(char) {
    this.word = this.word + char.rawChar;
  }
  deleteLastChar() {
    const arrayOfChars = this.word.split("");
    arrayOfChars.pop();
    this.word = arrayOfChars.join("");
  }
  addEvalLabels(labels) {
    this.evalLabels = labels;
  }
}
class Dictionary {
  #entries = {};

  constructor() { }

  static loadFromData(dictData) {
    const entries = dictData.split("\n");
    const dict = new Dictionary();

    for (const entry of entries) {
      dict.add(entry);
    }

    return dict;
  }

  add(entry) {
    entry = entry.trim().toLowerCase();

    // TODO: parameterize
    if (entry.length != 5) {
      throw new Error("Invalid entry: " + entry);
    }

    Object.defineProperty(this.#entries, entry, { writable: false });
  }
  contains(entry) {
    entry = entry.toLowerCase();
    return this.#entries.hasOwnProperty(entry);
  }
  pickRandomEntry() {
    const entries = Object.getOwnPropertyNames(this.#entries);
    const rndInt = Math.floor(Math.random() * entries.length);
    return entries[rndInt];
  }
}
class GameState {
  #gameRules;

  constructor(gameRules, activeAttempt, message) {
    this.#gameRules = gameRules;
    this.activeAttempt = activeAttempt;
    this.message = message;
  }
}
class GameRules {
  constructor() {
    this.maxAttempts = 6;
    this.wordLength = 5;
  }
}
class WordleGame {
  #activeAttempt;
  #dictionary;
  #targetWord;
  #gameRules;
  #gameIsOver;

  constructor(dictionary, gameRules) {
    this.#activeAttempt = new Attempt(0, "");
    this.#dictionary = dictionary;
    // TODO: normalize
    this.#targetWord = dictionary.pickRandomEntry();
    this.#gameRules = gameRules;
    this.#gameIsOver = false;
  }

  enterCharacter(char) {
    // TODO: refactor and delegate to attempt
    if (this.#gameIsOver) {
      return new GameState(this.#gameRules, null, "Game Over!");
    }
    else if (this.#activeAttempt.isFull) {
      // check type of character
      if (char.isEnter) {
        return this.validateActiveAttempt();
      }
      else if (char.isBackspace) {
        this.#activeAttempt.enterCharacter(char);
        return new GameState(this.#gameRules, this.#activeAttempt);
      }
      else {
        // active attempt is full
        return new GameState(this.#gameRules, this.#activeAttempt, "Row is full.");
      }
    }
    else {
      try {
        this.#activeAttempt.enterCharacter(char);
        return new GameState(this.#gameRules, this.#activeAttempt);
      }
      catch (error) {
        return new GameState(this.#gameRules, this.#activeAttempt, error.message);
      }
    }
  }

  validateActiveAttempt() {
    // guard clauses
    if (!this.#dictionary.contains(this.#activeAttempt.word)) {
      return new GameState(this.#gameRules, this.#activeAttempt, "Unknown word: " + this.#activeAttempt.word);
    }

    let evaluator = new Evaluator(this.#activeAttempt.word, this.#targetWord);
    let evaluation = evaluator.evaluate();

    this.#activeAttempt.addEvalLabels(evaluation);
    const validatedAttempt = this.#activeAttempt;

    // game over?
    const maxAttemptsReached = validatedAttempt.nr == this.#gameRules.maxAttempts - 1;
    const targetWordGuessed = (this.#targetWord.toLowerCase() == validatedAttempt.word.toLowerCase());

    this.#gameIsOver = maxAttemptsReached || targetWordGuessed;
    let message = null;

    if (this.#gameIsOver) {
      this.#activeAttempt = null;
      message = "Game Over";

      if (targetWordGuessed) {
        message += ": You won!";
      }
      else {
        message += ": You lost! Target word: " + this.#targetWord;
      }
    }
    else {
      this.#activeAttempt = new Attempt(validatedAttempt.nr + 1, "");
    }

    return new GameState(this.#gameRules, validatedAttempt, message);
  }
}
const EvalLabels = {
  mismatch: 0,
  directMatch: 1,
  indirectMatch: 2
}
class Evaluator {
  constructor(attemptWord, targetWord) {
    this.attemptWord = attemptWord.toLowerCase();
    this.targetWord = targetWord.toLowerCase();
  }

  evaluate() {
    const evalLabels = [];

    console.log("evaluating: " + this.attemptWord + " == " + this.targetWord);

    for (let i = 0; i < this.attemptWord.length; i++) {
      if (this.attemptWord[i] === this.targetWord[i]) {
        evalLabels.push(EvalLabels.directMatch)
      }
      else if (this.targetWord.indexOf(this.attemptWord[i]) >= 0) {
        evalLabels.push(EvalLabels.indirectMatch)
      } else {
        evalLabels.push(EvalLabels.mismatch)
      }
    }

    return evalLabels;
  }
}

/*
* TRANSLATORS
*/
const EvalLabelColors = [
  "gray",
  "green",
  "orange"
];
class GameStateVisualizer {
  #gameRules;
  #tileboard;
  #keyboard;

  constructor(gameRules, tileboard, keyboard) {
    this.#gameRules = gameRules;
    this.#tileboard = tileboard;
    this.#keyboard = keyboard;
  }

  visualize(gameState) {
    console.log(gameState);
    this.visualizeAttempt(gameState.activeAttempt);
    this.visualizeMessage(gameState.message);
  }
  visualizeAttempt(attempt) {
    console.log('visualize attempt', attempt);

    for (let i = 0; i < this.#gameRules.wordLength; i++) {
      this.#tileboard.setTileText(attempt.nr, i, attempt.word[i] ?? Chars.empty);

      const labelForLetterAtI = attempt.evalLabels[i];
      const evalLabelColor = EvalLabelColors[labelForLetterAtI];

      this.#tileboard.setTileColor(attempt.nr, i, evalLabelColor);
      this.#keyboard.setKeyColor(attempt.word[i] ?? Chars.empty, evalLabelColor);
    }
  }
  visualizeMessage(message) {
    if (!message) {
      return;
    }

    this.showAlert(message);
  }

  showAlert(message) {
    setTimeout(() => {
      alert(message);
    }, 0);
  }
}

/*
* BOOTSTRAPPING THE APP
*/
var rules = new GameRules();

// bootstrapping the UI
const tileboardElement = document.getElementById("tileboard");
const tileboard = new Tileboard(tileboardElement, rules.maxAttempts, rules.wordLength);
const keyboardElement = document.getElementById("keyboard");
const keyboard = new Keyboard(keyboardElement, onKeyboardkeyPressed);

// bootstrapping the core model
const dictDataResponse = await fetch("./words5.txt");
const dictData = await dictDataResponse.text();
const dictionary = Dictionary.loadFromData(dictData);
const game = new WordleGame(dictionary, rules);

// hooking up UI and core model
var visualizer = new GameStateVisualizer(rules, tileboard, keyboard);

function onKeyboardkeyPressed(keyCharacter) {
  const char = new Char(keyCharacter);
  const result = game.enterCharacter(char);
  visualizer.visualize(result);
}