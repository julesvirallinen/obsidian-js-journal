class eventPage {
  render(dv, page) {
    const date = dv.date(page.date);
    const year = page.date.toFormat("yyyy");
    dv.el("h3", page.name ?? page.file.name);
    dv.el(
      "p",
      `- [<] [[${date.toFormat("yyyy-MM-dd")}|${date.toFormat(
        "dd MMM"
      )}.]] [[${year}]]`
    );
    page.location && dv.el("p", `- [l] ${page.location}`);
    page.with && dv.el("p", `- [*] ${(page.with ?? []).join(", ")}`);
  }
}
