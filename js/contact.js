/* ---------------------------------------------------------
   contact.js — contact form validation
   Demonstrates: event handling, DOM manipulation,
   form validation and dynamic content updates.
   Rules:
     - No field may be empty
     - Email format must be valid
     - Phone number must contain only digits
   --------------------------------------------------------- */

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    message: document.getElementById("message")
  };

  var errors = {
    name: document.getElementById("error-name"),
    email: document.getElementById("error-email"),
    phone: document.getElementById("error-phone"),
    message: document.getElementById("error-message")
  };

  var status = document.getElementById("form-status");

  /* ---------- Validation helpers ---------- */
  function isValidEmail(value) {
    // Standard, reasonably strict email pattern.
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  function isDigitsOnly(value) {
    // Only digits allowed (no spaces, symbols or letters).
    return /^[0-9]+$/.test(value);
  }

  function showError(key) {
    fields[key].classList.add("invalid");
    errors[key].classList.add("show");
  }

  function clearError(key) {
    fields[key].classList.remove("invalid");
    errors[key].classList.remove("show");
  }

  function validateField(key) {
    var value = fields[key].value.trim();

    if (value === "") {
      // empty-field message
      errors[key].textContent = "This field cannot be empty.";
      showError(key);
      return false;
    }

    if (key === "email" && !isValidEmail(value)) {
      errors.email.textContent = "Please enter a valid email address.";
      showError("email");
      return false;
    }

    if (key === "phone" && !isDigitsOnly(value)) {
      errors.phone.textContent = "Phone number must contain only digits.";
      showError("phone");
      return false;
    }

    clearError(key);
    return true;
  }

  /* ---------- Live validation as the user types ---------- */
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener("input", function () {
      if (fields[key].classList.contains("invalid")) {
        validateField(key);
      }
    });
  });

  /* ---------- Submit handling ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var keys = Object.keys(fields);
    var allValid = true;

    // validate every field (do not short-circuit, so all errors show)
    keys.forEach(function (key) {
      if (!validateField(key)) {
        allValid = false;
      }
    });

    if (!allValid) {
      status.classList.remove("show");
      // focus the first invalid field for accessibility
      for (var i = 0; i < keys.length; i++) {
        if (fields[keys[i]].classList.contains("invalid")) {
          fields[keys[i]].focus();
          break;
        }
      }
      return;
    }

    // Success — dynamic content update (no real backend in this project).
    status.textContent =
      "Thank you, " + fields.name.value.trim() +
      "! Your message has been received. (Demo only — no message is actually sent.)";
    status.classList.add("show");
    form.reset();

    keys.forEach(clearError);
  });
})();
