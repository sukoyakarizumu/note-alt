(() => {
  const ALT_BUTTON_CLASS_NAME = "note-extension-alt-button";
  const ALT_EDITOR_CLASS_NAME = "note-extension-alt-editor";
  const ALT_INPUT_CLASS_NAME = "note-extension-alt-editor-input";
  const ALT_CANCEL_CLASS_NAME = "note-extension-alt-editor-cancel";

  const editorMargin = 8;
  const editorHeight = 50;

  let editingIds = [];

  const renderAltEditor = imgEl => {
    editingIds.push(imgEl.id);
    const editorEl = document.createElement("form");
    editorEl.classList.add(ALT_EDITOR_CLASS_NAME);
    editorEl.style.left = imgEl.offsetLeft + editorMargin + "px";
    editorEl.style.top =
      imgEl.offsetTop + imgEl.height - editorHeight - editorMargin + "px";
    editorEl.style.width = imgEl.width - editorMargin * 2 + "px";

    const inputEl = document.createElement("input");
    inputEl.classList.add(ALT_INPUT_CLASS_NAME);
    inputEl.setAttribute("title", "画像のALT");
    inputEl.setAttribute("placeholder", "画像のALT");
    inputEl.value = imgEl.alt;
    editorEl.appendChild(inputEl);
    inputEl.select();

    const cancelEl = document.createElement("button");
    cancelEl.classList.add(ALT_CANCEL_CLASS_NAME);
    cancelEl.classList.add("renewal-p-icon--editorClose");
    cancelEl.setAttribute("type", "button");
    cancelEl.setAttribute("aria-label", "画像のALTの編集をキャンセル");
    editorEl.appendChild(cancelEl);

    document.body.appendChild(editorEl);

    const closeAltEditor = () => {
      editingIds = editingIds.filter(id => id !== imgEl.id);
      removeAllAltButtons();
      const buttonEl = renderAltButton(imgEl);
      buttonEl.focus();
      editorEl.remove();
    };

    inputEl.focus();
    cancelEl.addEventListener("click", () => {
      closeAltEditor();
    });
    editorEl.addEventListener("submit", evt => {
      imgEl.alt = inputEl.value;
      evt.preventDefault();
      closeAltEditor();
    });
  };

  const renderAltButton = imgEl => {
    if (editingIds.includes(imgEl.id)) {
      return;
    }
    const buttonEl = document.createElement("button");
    buttonEl.classList.add(ALT_BUTTON_CLASS_NAME);
    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("aria-label", "画像のALTを追加");
    buttonEl.innerText = "ALT: " + (imgEl.alt || "(なし)");
    buttonEl.style.left = imgEl.offsetLeft + editorMargin + "px";
    buttonEl.style.top =
      imgEl.offsetTop + imgEl.height - editorHeight - editorMargin + "px";
    buttonEl.style.maxWidth = imgEl.width - editorMargin * 2 + "px";
    buttonEl.addEventListener("click", () => {
      renderAltEditor(imgEl);
    });
    document.body.appendChild(buttonEl);

    return buttonEl;
  };

  const removeAllAltButtons = () => {
    const buttonEls = document.getElementsByClassName(ALT_BUTTON_CLASS_NAME);
    Array.from(buttonEls).forEach(el => el.remove());
  };

  document.addEventListener("selectionchange", evt => {
    removeAllAltButtons();
    const selectedEl = document.querySelector(".is-selected");
    if (selectedEl && selectedEl.tagName === "IMG") {
      renderAltButton(selectedEl);
    }
  });
})();
