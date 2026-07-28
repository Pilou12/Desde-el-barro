export class BaseMinigame {
  constructor(type, isNarrative = false) {
    this.type = type;
    this.isNarrative = isNarrative;
    this.status = "PLAYING"; // PLAYING, WON, ELIMINATED, PENALTIES
    this.matchLogs = [];
  }
}
