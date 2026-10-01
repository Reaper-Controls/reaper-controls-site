// Reaper Controls — waitlist form progressive enhancement
//
// Forms work fine with no JS at all (plain POST to Formspree, which then
// redirects to its own generic confirmation page). When JS is available,
// this intercepts the submit, posts via fetch so Formspree returns JSON
// instead of redirecting, and swaps the form for an inline confirmation
// styled to match the rest of the site — no page reload, no detour to a
// Formspree-branded page.

(function () {
  function onSubmit(event) {
    var form = event.target;
    if (!form || form.id !== "waitlist-form") return;

    event.preventDefault();

    var button = form.querySelector("button[type=submit]");
    var buttonLabel = button ? button.textContent : null;
    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }

    // clear any previous error state
    var existingError = form.parentNode.querySelector(".waitlist-error");
    if (existingError) existingError.remove();

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          showSuccess(form);
        } else {
          return response.json().then(
            function (data) {
              var message =
                data && data.errors && data.errors.length
                  ? data.errors.map(function (e) { return e.message; }).join(", ")
                  : "Something went wrong submitting the form.";
              throw new Error(message);
            },
            function () {
              throw new Error("Something went wrong submitting the form.");
            }
          );
        }
      })
      .catch(function (err) {
        showError(form, err && err.message);
        if (button) {
          button.disabled = false;
          button.textContent = buttonLabel;
        }
      });
  }

  function showSuccess(form) {
    var container = form.closest(".waitlist");
    if (!container) return;

    var success = document.createElement("div");
    success.className = "waitlist-success";
    success.innerHTML =
      '<span class="badge">On the list</span>' +
      "<h3>You're in.</h3>" +
      "<p>One email when it ships — nothing before that.</p>";

    form.replaceWith(success);

    var eyebrow = container.querySelector(".waitlist-eyebrow");
    if (eyebrow) eyebrow.textContent = "THANKS FOR SIGNING UP";
  }

  function showError(form, message) {
    var error = document.createElement("p");
    error.className = "waitlist-error";
    error.textContent =
      message ||
      "Something went wrong submitting the form. Try again, or email nathan@reapercontrols.com directly.";
    form.parentNode.insertBefore(error, form);
  }

  document.addEventListener("submit", onSubmit);
})();
