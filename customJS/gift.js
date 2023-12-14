class gift {
  findGiftsGiven(dv, personPage) {
    return dv
      .pages("#gift-given")
      .where((p) =>
        dv.func.contains(dv.func.array(p.for), personPage.file.link)
      )
      .sort((p) => -p.date);
  }

  findGiftsReceived(dv, personPage) {
    return dv
      .pages("#gift-received")
      .where((p) =>
        dv.func.contains(dv.func.array(p.from), personPage.file.link)
      )
      .sort((p) => -p.date);
  }
}
