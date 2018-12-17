/**
 * 3D Foundation Project
 * Copyright 2018 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "@ff/ui/Layout";
import "@ff/ui/Button";
import { IButtonClickEvent } from "@ff/ui/Button";

import TaskController from "../controllers/TaskController";

import CustomElement, { customElement, property, html } from "@ff/ui/CustomElement";

////////////////////////////////////////////////////////////////////////////////

@customElement("sv-task-bar")
export default class TaskBar extends CustomElement
{
    @property({ attribute: false })
    controller: TaskController;

    constructor(controller?: TaskController)
    {
        super();
        this.controller = controller;
    }

    firstConnected()
    {

    }

    render()
    {
        return html`
            <label>Logo<label>
            <ff-flex-row @click=${this.onClickTask}>
            
            </ff-flex-row>
        `;
    }

    protected onClickTask(event: MouseEvent)
    {

    }
}