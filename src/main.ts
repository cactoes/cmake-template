#!/usr/bin/env node

import fs from "fs";
import fse from "fs-extra";
import path from "path";

function error(message: string): number {
    console.error(`Error: ${message}`);
    return 1;
}

function write_variables(target_path: string | URL, variables: { [key: string]: string }): void {
    let file = fs.readFileSync(target_path).toString();
    for (const item of Object.keys(variables))
        file = file.replaceAll(item, variables[item]);
    fs.writeFileSync(target_path, file);
}

function main(argc: number, argv: string[]): number {
    if (argc < 3)
        return error("Too few arguments");

    if (argv[2] == "help" || argv[2] == "-h" || argv[2] == "--help") {
        console.log("Example:\n    cmake-template name");
        return 0;
    }

    let project_name = argv[2];

    // for compatibility replace spaces
    if (project_name.includes(" ")) {
        console.log("Spaced have been replaced with \"_\"");
        project_name = project_name.replaceAll(" ", "_");
    }

    const template_dir = path.join(__dirname, "../template");
    const target_path = process.cwd();
    const folder_name = target_path.split("\\").at(-1);

    // this will trigger at drive root (ex. C:\)
    if (!folder_name)
        return error("Invalid path");

    // all available variables to use in the template
    const variables = {
        "$FOLDER_NAME": folder_name,
        "$PROJECT_NAME": project_name
    };

    // copy the template
    for (const item of fs.readdirSync(template_dir))
        fse.cpSync(path.join(template_dir, item), path.join(target_path, item), { recursive: true });

    // replace the vars in the main cmake file
    write_variables(path.join(target_path, "CMakeLists.txt"), variables);

    // replace the vars in the project file
    write_variables(path.join(target_path, "src/$PROJECT_NAME", "CMakeLists.txt"), variables);

    // rename the folder
    fs.renameSync(path.join(target_path, "src/$PROJECT_NAME"), path.join(target_path, `src/${variables["$PROJECT_NAME"]}`));

    console.log("Successfully created cmake template");

    return 0;
}

process.exit(main(process.argv.length, process.argv));