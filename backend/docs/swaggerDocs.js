/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: GitHub access token of user
 *                 example: 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
 *               title:
 *                 type: string
 *                 description: Title of the project.
 *                 example: AI-Powered Task Manager
 *               description:
 *                 type: string
 *                 description: Detailed description of the project.
 *                 example: A task manager that uses AI to suggest priorities.
 *               short_description:
 *                 type: string
 *                 description: Short description of the project.
 *                 example: AI helps prioritize tasks.
 *               type:
 *                 type: string
 *                 description: Type of the project (e.g., Web App, Mobile App, Desktop App).
 *                 example: Web App
 *               mvp:
 *                 type: object
 *                 description: MVP features of the project.
 *                 items:
 *                   type: string
 *                   example: "AI task prioritization"
 *               stretch:
 *                 type: object
 *                 description: Stretch features of the project.
 *                 items:
 *                   type: string
 *                   example: "Team collaboration"
 *               timeline:
 *                 type: object
 *                 description: Timeline for the project phases.
 *                 properties:
 *                   frontend:
 *                     type: array
 *                     description: List of frontend tasks.
 *                     items:
 *                       type: object
 *                       properties:
 *                         task:
 *                           type: string
 *                           description: A single frontend task.
 *                           example: "Create initial wireframes and mockups in Figma"
 *                   backend:
 *                     type: array
 *                     description: List of backend tasks.
 *                     items:
 *                       type: object
 *                       properties:
 *                         task:
 *                           type: string
 *                           description: A single backend task.
 *                           example: "Set up database schema in PostgreSQL"
 *               team_lead_id:
 *                 type: integer
 *                 description: ID of the team lead for the project.
 *                 example: 1
 *               thumbnail:
 *                 type: string
 *                 description: Thumbnail image file for the project.
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created project.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the project.
 *                   example: AI-Powered Task Manager
 *                 description:
 *                   type: string
 *                   description: Detailed description of the project.
 *                   example: A task manager that uses AI to suggest priorities.
 *                 short_description:
 *                   type: string
 *                   description: Short description of the project.
 *                   example: AI helps prioritize tasks.
 *                 type:
 *                   type: string
 *                   description: Type of the project.
 *                   example: Web App
 *                 mvp:
 *                   type: array
 *                   description: MVP features of the project.
 *                   items:
 *                     type: string
 *                     example: "AI task prioritization"
 *                 stretch:
 *                   type: array
 *                   description: Stretch features of the project.
 *                   items:
 *                     type: string
 *                     example: "Team collaboration"
 *                 timeline:
 *                   type: object
 *                   description: Timeline for the project phases.
 *                   properties:
 *                     frontend:
 *                       type: array
 *                       description: List of frontend tasks.
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A single frontend task.
 *                             example: "Create initial wireframes and mockups in Figma"
 *                     backend:
 *                       type: array
 *                       description: List of backend tasks.
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A single backend task.
 *                             example: "Set up database schema in PostgreSQL"
 *                 team_lead_id:
 *                   type: integer
 *                   description: ID of the team lead for the project.
 *                   example: 1
 *                 github_repo_url:
 *                   type: string
 *                   description: URL of the GitHub repository created for the project.
 *                   example: https://github.com/user/repo
 *                 thumbnail:
 *                   type: string
 *                   description: URL of the uploaded thumbnail image.
 *                   example: https://s3.amazonaws.com/bucket-name/thumbnail.png
 *       500:
 *         description: Server error.
 */





/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: GitHub access token for updating the repository.
 *                 example: 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
 *               title:
 *                 type: string
 *                 description: Updated title of the project.
 *                 example: AI-Powered Task Manager
 *               description:
 *                 type: string
 *                 description: Updated detailed description of the project.
 *                 example: A task manager that uses AI to suggest priorities.
 *               short_description:
 *                 type: string
 *                 description: Updated short description of the project.
 *                 example: AI helps prioritize tasks.
 *               type:
 *                 type: string
 *                 description: Updated type of the project (e.g., Web App, Mobile App, Desktop App).
 *                 example: Web App
 *               mvp:
 *                 type: object
 *                 description: Updated MVP features of the project.
 *                 properties:
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["AI task prioritization", "Basic task management"]
 *               stretch:
 *                 type: object
 *                 description: Updated stretch features of the project.
 *                 properties:
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Team collaboration", "Voice input", "Calendar sync"]
 *               timeline:
 *                 type: object
 *                 description: Updated timeline for the project phases.
 *                 properties:
 *                   frontend:
 *                     type: array
 *                     description: List of updated frontend tasks.
 *                     items:
 *                       type: object
 *                       properties:
 *                         task:
 *                           type: string
 *                           description: A single frontend task.
 *                           example: "Update wireframes and mockups in Figma"
 *                   backend:
 *                     type: array
 *                     description: List of updated backend tasks.
 *                     items:
 *                       type: object
 *                       properties:
 *                         task:
 *                           type: string
 *                           description: A single backend task.
 *                           example: "Optimize database schema in PostgreSQL"
 *               team_lead_id:
 *                 type: integer
 *                 description: Updated ID of the team lead for the project.
 *                 example: 2
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Updated thumbnail image file for the project.
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated project.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Updated title of the project.
 *                   example: AI-Powered Task Manager
 *                 description:
 *                   type: string
 *                   description: Updated detailed description of the project.
 *                   example: A task manager that uses AI to suggest priorities.
 *                 short_description:
 *                   type: string
 *                   description: Updated short description of the project.
 *                   example: AI helps prioritize tasks.
 *                 type:
 *                   type: string
 *                   description: Updated type of the project.
 *                   example: Web App
 *                 mvp:
 *                   type: object
 *                   description: Updated MVP features of the project.
 *                   properties:
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["AI task prioritization", "Basic task management"]
 *                 stretch:
 *                   type: object
 *                   description: Updated stretch features of the project.
 *                   properties:
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Team collaboration", "Voice input", "Calendar sync"]
 *                 timeline:
 *                   type: object
 *                   description: Updated timeline for the project phases.
 *                   properties:
 *                     frontend:
 *                       type: array
 *                       description: List of updated frontend tasks.
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A single frontend task.
 *                             example: "Update wireframes and mockups in Figma"
 *                     backend:
 *                       type: array
 *                       description: List of updated backend tasks.
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A single backend task.
 *                             example: "Optimize database schema in PostgreSQL"
 *                 team_lead_id:
 *                   type: integer
 *                   description: Updated ID of the team lead for the project.
 *                   example: 2
 *                 github_repo_url:
 *                   type: string
 *                   description: URL of the GitHub repository for the project.
 *                   example: https://github.com/user/repo
 *                 thumbnail:
 *                   type: string
 *                   description: URL of the updated thumbnail image.
 *                   example: https://s3.amazonaws.com/bucket-name/updated-thumbnail.png
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */




/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the deleted project.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the deleted project.
 *                   example: AI-Powered Task Manager
 *                 description:
 *                   type: string
 *                   description: Detailed description of the deleted project.
 *                   example: A task manager that uses AI to suggest priorities.
 *                 short_description:
 *                   type: string
 *                   description: Short description of the deleted project.
 *                   example: AI helps prioritize tasks.
 *                 type:
 *                   type: string
 *                   description: Type of the deleted project.
 *                   example: Web App
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */



/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the deleted project.
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the deleted project.
 *                   example: AI-Powered Task Manager
 *                 description:
 *                   type: string
 *                   description: Detailed description of the deleted project.
 *                   example: A task manager that uses AI to suggest priorities.
 *                 short_description:
 *                   type: string
 *                   description: Short description of the deleted project.
 *                   example: AI helps prioritize tasks.
 *                 type:
 *                   type: string
 *                   description: Type of the deleted project.
 *                   example: Web App
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */





/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve a list of all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of all projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the project.
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: Title of the project.
 *                     example: AI-Powered Task Manager
 *                   description:
 *                     type: string
 *                     description: Detailed description of the project.
 *                     example: A task manager that uses AI to suggest priorities.
 *                   short_description:
 *                     type: string
 *                     description: Short description of the project.
 *                     example: AI helps prioritize tasks.
 *                   type:
 *                     type: string
 *                     description: Type of the project (e.g., Web App, Mobile App, Desktop App).
 *                     example: Web App
 *                   mvp:
 *                     type: object
 *                     description: MVP features of the project.
 *                     properties:
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["AI task prioritization", "Basic task management"]
 *                   stretch:
 *                     type: object
 *                     description: Stretch features of the project.
 *                     properties:
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Team collaboration", "Voice input", "Calendar sync"]
 *                   timeline:
 *                     type: object
 *                     description: Timeline for the project phases.
 *                     properties:
 *                       frontend:
 *                         type: array
 *                         description: List of frontend tasks.
 *                         items:
 *                           type: object
 *                           properties:
 *                             task:
 *                               type: string
 *                               description: A single frontend task.
 *                               example: "Create initial wireframes and mockups in Figma"
 *                       backend:
 *                         type: array
 *                         description: List of backend tasks.
 *                         items:
 *                           type: object
 *                           properties:
 *                             task:
 *                               type: string
 *                               description: A single backend task.
 *                               example: "Set up database schema in PostgreSQL"
 *                   team_lead_id:
 *                     type: integer
 *                     description: ID of the team lead for the project.
 *                     example: 1
 *                   github_repo_url:
 *                     type: string
 *                     description: URL of the GitHub repository for the project.
 *                     example: https://github.com/user/repo
 *                   thumbnail:
 *                     type: string
 *                     description: URL of the uploaded thumbnail image.
 *                     example: https://s3.amazonaws.com/bucket-name/thumbnail.png
 *       500:
 *         description: Server error.
 */




// Generate a project from AI prompt
/**
 * @swagger
 * /generateProject:
 *   post:
 *     summary: Generate a project from an AI prompt
 *     description: Takes an AI prompt and generates a project based on it.
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The AI prompt to generate the project.
 *                 example: "Create a project management tool"
 *     responses:
 *       200:
 *         description: Successfully generated the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the project.
 *                 short description:
 *                   type: string
 *                   description: A brief description of the project.
 *                 description:
 *                   type: string
 *                   description: A detailed description of the project.
 *                 type:
 *                   type: string
 *                   description: The type of the project (e.g., Mobile App, Web App).
 *                 topic:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Topics related to the project.
 *                 tech stack:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Technologies used in the project.
 *                 mvp:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Minimum viable product features.
 *                 stretch:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Stretch goals for the project.
 *                 timeline:
 *                   type: object
 *                   properties:
 *                     frontend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A frontend task.
 *                     backend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: A backend task.
 *                 thumbnail:
 *                   type: string
 *                   description: The URL of the project's thumbnail image.
 *       500:
 *         description: Server error.
 */
