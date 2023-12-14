class actions {
  addEvent() {}
  addGiftGiven(dv) {
    dv.span(
      "```button\nname Add given gift\ntype command\naction QuickAdd: Gift given\n```\n^button-addGiftGiven"
    );
  }
  addGiftReceived(dv) {
    dv.span(
      "```button\nname Add received gift\ntype command\naction QuickAdd: Gift received\n```\n^button-addGiftReceived"
    );
  }
  addEvent(dv) {
    dv.el(
      "span",
      "```button\nname Add event\ntype command\naction QuickAdd: Add event\n```\n^button-addEvent"
      // styles
    );
  }
}
