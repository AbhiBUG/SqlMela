const sendDiscordNotification = async (bug) => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error(
        "DISCORD_WEBHOOK_URL is not configured"
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: "SqlMela Bug Bot",

        embeds: [
          {
            title: `🐞 New Bug Report - ${bug.ticketId}`,

            description: bug.description,

            color: 16753920,

            fields: [
              {
                name: "Issue Type",
                value: bug.issueType || "Not specified",
                inline: true,
              },

              {
                name: "Status",
                value: bug.status || "Open",
                inline: true,
              },

              {
                name: "Reported By",
                value: bug.userEmail || "Unknown",
                inline: true,
              },

              {
                name: "Page",
                value: bug.pageUrl || "Unknown",
                inline: false,
              },

              {
                name: "Browser",
                value: bug.browser
                  ? bug.browser.substring(0, 1000)
                  : "Unknown",
                inline: false,
              },

              {
                name: "Challenge",
                value:
                  bug.challengeName ||
                  "Not applicable",
                inline: false,
              },

              {
                name: "User Query",
                value: bug.userQuery
                  ? `\`\`\`sql\n${bug.userQuery}\n\`\`\``
                  : "Not available",
                inline: false,
              },
            ],

            footer: {
              text: "SqlMela Bug Reporting System",
            },

            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Discord API error:",
        response.status,
        errorText
      );

      return false;
    }

    console.log(
      `Discord notification sent for ${bug.ticketId}`
    );

    return true;

  } catch (error) {
    console.error(
      "Discord notification failed:",
      error.message
    );

    return false;
  }
};

export default sendDiscordNotification;