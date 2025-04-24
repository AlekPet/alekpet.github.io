function mEl(
  tag,
  {
    style = {},
    cls = [],
    text = "",
    parent = null,
    childs = [],
    innerHTML = null,
    dataset = null,
  }
) {
  const el = document.createElement(tag);
  Object.assign(el.style, style);
  cls.map((c) => el.classList.add(c));

  if (innerHTML) {
    el.innerHTML = innerHTML;
  } else {
    el.textContent = text;
  }

  if (dataset) {
    for (const p in dataset) {
      el.dataset[p] = dataset[p];
    }
  }

  childs.forEach((c) => el.append(c));

  if (parent) parent.append(el);

  return el;
}

function createLinks(links) {
  return mEl("ul", {
    cls: ["group", "group_links"],
    style: { display: "none" },
    childs: links.map(({ name, url }) =>
      mEl("li", {
        cls: ["group_title"],
        innerHTML: `<a href="${url}" title=${name}>${name}</a>`,
      })
    ),
  });
}

let idx = 0;
function creteElementsList(data, group_hide = false) {
  const group = mEl("ul", {
    cls: ["group"],
    style: { display: group_hide ? "none" : "block" },
  });
  group.setAttribute("g-idx", idx++);

  for (const d in data) {
    const group_data = data[d];
    const group_settings = group_data.settings ?? {};
    const group_title = mEl("div", {
      cls: ["group_title"],
      text: d,
    });

    let linksExists = false;
    let groupsExists = false;

    if (group_settings.bg) {
      group_title.style.background = group_settings.bg;
    }

    const group_li = mEl("li", {
      parent: group,
      cls: ["group_item"],
      childs: [group_title],
    });

    if (
      group_data?.links &&
      Array.isArray(group_data.links) &&
      group_data.links.length
    ) {
      linksExists = true;
      group_li.append(createLinks(group_data.links));
    }

    if (group_data?.groups && Object.keys(group_data.groups).length > 0) {
      groupsExists = true;
      group_li.append(creteElementsList(group_data.groups, true));
    }

    if (!groupsExists && !linksExists) {
      mEl("ul", {
        parent: group_li,
        cls: ["group", "group_empty"],
        style: { display: "none" },
        childs: [
          mEl("div", {
            style: { background: "orange" },
            cls: ["group_title"],
            text: "This group is empty!",
          }),
        ],
      });
    }
  }
  return group;
}

function createGroupList(selectorWrapper, data) {
  const wrapper =
    typeof selectorWrapper === "string"
      ? document.querySelector(selectorWrapper)
      : typeof selectorWrapper === HTMLElement
      ? selectorWrapper
      : null;
  if (!wrapper && data) return;

  const group = creteElementsList(data);
  wrapper.append(group);

  group.addEventListener("click", function (e) {
    const target = e.target;

    if (
      target.className === "group_title" ||
      target.className === "subgroup group_title"
    ) {
      const uls = Array.from(target.parentElement.children).filter(
        (tag) => tag.tagName === "UL"
      );

      if (uls) {
        uls.map(
          (el) =>
            (el.style.display = el.style.display === "none" ? "block" : "none")
        );
      }
    }
  });
}

globalThis.mEl = mEl;
globalThis.createGroupList = createGroupList;

export { mEl, createGroupList };
