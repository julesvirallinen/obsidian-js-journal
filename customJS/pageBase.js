class pageBase {
  render(dv, page) {
    let fileClasses;
    if (typeof page?.fileClass === "string") {
      fileClasses = [page?.fileClass];
    } else {
      fileClasses = [...(page?.fileClass ?? [])];
    }

    let tags = page.tags ?? [];
    let path = page.file.link.path;

    if (path.includes("00.03_templates/")) {
      return dv.paragraph("PAGEBASE: 🥵 tis a template");
    }
    if (fileClasses.includes("Person")) {
      const { person } = customJS;
      person.renderPersonInfo(dv, page);
    }
    if (fileClasses.includes("Yearly")) {
      const { yearly } = customJS;
      return yearly.render(dv, page);
    }

    if (tags.includes("weekly")) {
      const { weekly } = customJS;
      return weekly.render(dv, page);
    }

    if (tags.includes("daily")) {
      const { daily } = customJS;
      return daily.renderDaily(dv, page);
    }

    if (tags.includes("event")) {
      const { eventPage } = customJS;
      return eventPage.render(dv, page);
    }

    if (tags.includes("clothing")) {
      const { clothing } = customJS;
      return clothing.renderClothingInfo(dv, page);
    }

    dv.el("p", "🚧 ...");
  }
}
