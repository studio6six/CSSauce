# CSSauce 🎨

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)

**CSSauce** is a lightweight Chrome extension that allows you to inject custom CSS into any website. Whether you want to fix a broken layout, create a dark mode for a site that doesn't have one, or just customize the web to your liking, CSSauce makes it easy.

## Features

-   **URL-Based Overrides**: Apply CSS to specific pages using exact URLs or Regex patterns.
-   **Instant Injection**: Changes are applied immediately upon reloading the page.
-   **Easy Management**: View, edit, and delete all your overrides from a single, clean interface.
-   **Auto-Detection**: The extension automatically detects and displays active overrides for the current tab.

## Installation

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** by toggling the switch in the top right corner.
4.  Click **Load unpacked**.
5.  Select the `cssauce` directory from your tracking location.

## How to Use

### Adding an Override
1.  Navigate to the website you want to customize.
2.  Click the **CSSauce icon** in your Chrome toolbar.
3.  Click the **"Add Current URL Override"** button.
4.  The editor will open with the current URL pre-filled.
5.  (Optional) Add a **Title** to easily identify this override later.
6.  Enter your custom CSS in the text area (e.g., `body { background-color: #333; color: #fff; }`).
7.  Click **Save**.

### Managing Overrides
-   **Edit**: Click the "Edit" button on any override in the list to modify its URL, Title, or CSS.
-   **Delete**: Click the "Del" button to remove an override permanently.
-   **View Active**: The top section of the popup ("Active Overrides") shows you which rules are currently affecting the tab you are viewing.

## License

This project is for personal use and development.
