import pool from "../config/db.js";
import sendDiscordNotification from "../services/discordService.js";

export const bugReport = async (req, res) => {
  console.log("Bug reporting initiated");
  try {
    const {
      issueType,
      description,
      metadata,
    } = req.body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!issueType) {
      return res.status(400).json({
        success: false,
        message: "Issue type is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // --------------------------------
    // Generate Ticket ID
    // --------------------------------

    const ticketId =
      "BUG-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    // --------------------------------
    // Get User ID
    // --------------------------------

    const userId =
      req.session?.user?.id || null;

    // --------------------------------
    // Get Metadata
    // --------------------------------

    const pageUrl =
      metadata?.pageUrl || null;

    const browser =
      metadata?.browser || null;

    const screenResolution =
      metadata?.screenResolution || null;

    // --------------------------------
    // Insert into PostgreSQL
    // --------------------------------

    const result = await pool.query(
      `
      INSERT INTO bug_reports (
        ticket_id,
        user_id,
        issue_type,
        description,
        page_url,
        browser,
        screen_resolution
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING *
      `,
      [
        ticketId,
        userId,
        issueType,
        description,
        pageUrl,
        browser,
        screenResolution,
      ]
    );

    const bug = result.rows[0];

    // --------------------------------
    // Send Discord Notification
    // --------------------------------

    await sendDiscordNotification({
      ticketId: bug.ticket_id,
      issueType: bug.issue_type,
      description: bug.description,
      status: bug.status,
      pageUrl: bug.page_url,
      browser: bug.browser,
    });

    // --------------------------------
    // Response
    // --------------------------------

    return res.status(201).json({
      success: true,

      message: "Bug report submitted successfully",

      ticketId: bug.ticket_id,

      bug: {
        id: bug.id,
        ticketId: bug.ticket_id,
        status: bug.status,
        createdAt: bug.created_at,
      },
    });

  } catch (error) {
    console.error(
      "Create bug report error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create bug report",
    });
  }
};