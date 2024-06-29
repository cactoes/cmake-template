#!/usr/bin/env node

import fs from "fs";
import fse from "fs-extra";
import path from "path";

function error(message: string) {
    console.error(`Error: ${message}`);
    return 1;
}

function main(argc: number, argv: string[]): number {
    if (argc < 3)
        return error("Too few arguments");

    if (argv[2] == "help" || argv[2] == "-h" || argv[2] == "--help") {
        console.log("Example:\n    cmake-template name");
        return 0;
    }

    const template_dir = path.join(__dirname, "../template");
    const target_path = process.cwd();
    const folder_name = target_path.split("\\").at(-1);

    if (!folder_name)
        return error("Invalid folder");

    const variables = {
        "$FOLDER_NAME": folder_name,
        "$PROJECT_NAME": argv[2]
    };

    // copy all contents of template
    for (const item of fs.readdirSync(template_dir))
        fse.cpSync(path.join(template_dir, item), path.join(target_path, item), { recursive: true });

    // replace the vars in the main cmake file
    let cmake_root_file = fs.readFileSync(path.join(target_path, "CMakeLists.txt")).toString();
    for (const item of Object.keys(variables))
        cmake_root_file = cmake_root_file.replaceAll(item, (variables as any)[item]);
    fs.writeFileSync(path.join(target_path, "CMakeLists.txt"), cmake_root_file);

    // replace the vars in the project file
    let cmake_project_file = fs.readFileSync(path.join(target_path, "src/$PROJECT_NAME", "CMakeLists.txt")).toString();
    for (const item of Object.keys(variables))
        cmake_project_file = cmake_project_file.replaceAll(item, (variables as any)[item]);
    fs.writeFileSync(path.join(target_path, "src/$PROJECT_NAME", "CMakeLists.txt"), cmake_project_file);

    // rename the folder
    fs.renameSync(path.join(target_path, "src/$PROJECT_NAME"), path.join(target_path, `src/${variables["$PROJECT_NAME"]}`));

    console.log("Successfully created cmake template");

    return 0;
}

process.exit(main(process.argv.length, process.argv));