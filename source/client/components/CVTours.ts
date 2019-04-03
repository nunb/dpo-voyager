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

import Component, { types } from "@ff/graph/Component";

import CTweenMachine, {
    EEasingCurve,
    ITweenState,
    ITweenTarget
} from "@ff/graph/components/CTweenMachine";

import { ITour, ITours, ITourStep } from "common/types/setup";

////////////////////////////////////////////////////////////////////////////////

export default class CVTours extends Component
{
    static readonly typeName: string = "CVTours";

    protected static readonly ins = {
        enabled: types.Boolean("Tours.Enabled", { static: true }),
        tourIndex: types.Integer("Tours.Index", { static: true }),
        stepIndex: types.Integer("Step.Index", { static: true }),
        next: types.Event("Step.Next", { static: true }),
        previous: types.Event("Step.Previous", { static: true }),
        first: types.Event("Step.First", { static: true }),
    };

    protected static readonly outs = {
        tourIndex: types.Integer("Tour.Index"),
        tourTitle: types.String("Tour.Title"),
        tourLead: types.String("Tour.Lead"),
        stepCount: types.Integer("Tour.Steps"),
        stepIndex: types.Integer("Step.Index"),
        stepTitle: types.String("Step.Title"),
    };

    ins = this.addInputs(CVTours.ins);
    outs = this.addOutputs(CVTours.outs);

    private _tours: ITour[] = [];

    get tours() {
        return this._tours;
    }
    get activeSteps() {
        const tour = this.activeTour;
        return tour ? tour.steps : null;
    }
    get activeTour() {
        return this._tours[this.outs.tourIndex.value];
    }
    get activeStep() {
        const tour = this.activeTour;
        return tour ? tour.steps[this.outs.stepIndex.value] : null;
    }


    get tweenMachine() {
        return this.getComponent(CTweenMachine);
    }

    dispose()
    {
        super.dispose();
    }

    update()
    {
        const { ins, outs } = this;

        const tours = this._tours;

        if (!ins.enabled.value || tours.length === 0) {
            return false;
        }

        const machine = this.tweenMachine;
        const tourIndex = Math.min(tours.length - 1, Math.max(-1, ins.tourIndex.value));
        const tour = tours[tourIndex];
        const stepCount = tour ? tour.steps.length : 0;

        let nextStepIndex = -1;

        if (ins.tourIndex.changed || ins.enabled.changed) {
            if (tourIndex !== outs.tourIndex.value) {
                nextStepIndex = 0;
            }

            outs.tourIndex.setValue(tourIndex);
            outs.tourTitle.setValue(tour ? tour.title : "");
            outs.tourLead.setValue(tour ? tour.lead : "");
        }

        if (stepCount === 0) {
            outs.stepIndex.setValue(-1);
            outs.stepTitle.setValue("");
            return true;
        }

        if (ins.stepIndex.changed) {
            nextStepIndex = Math.min(tour.steps.length - 1, Math.max(-1, ins.stepIndex.value));
            const step = tour.steps[nextStepIndex];
            outs.stepIndex.setValue(nextStepIndex);
            outs.stepCount.setValue(stepCount);
            outs.stepTitle.setValue(step.title);
            machine.ins.id.setValue(step.id);
            machine.ins.recall.set();
            return true;
        }

        if (ins.first.changed) {
            nextStepIndex = 0;
        }
        if (ins.next.changed) {
            nextStepIndex = (outs.stepIndex.value + 1) % stepCount;
        }
        if (ins.previous.changed) {
            nextStepIndex = (outs.stepIndex.value - 1) % stepCount;
        }

        if (nextStepIndex >= 0) {
            const step = tour.steps[nextStepIndex];
            outs.stepIndex.setValue(nextStepIndex);
            outs.stepTitle.setValue(step.title);
            machine.ins.id.setValue(step.id);
            machine.ins.tween.set();
        }

        return true;
    }

    fromData(data: ITours)
    {
        this._tours = data.map(tour => ({
            title: tour.title,
            steps: tour.steps,
            lead: tour.lead || "",
            tags: tour.tags || [],
        }));

        this.ins.tourIndex.setValue(0);
    }

    toData(): ITours | null
    {
        if (this._tours.length === 0) {
            return null;
        }

        return  this._tours.map(tour => {
            const data: Partial<ITour> = {
                title: tour.title,
                steps: tour.steps,
            };

            if (tour.lead) {
                data.lead = tour.lead;
            }
            if (tour.tags.length > 0) {
                data.tags = tour.tags;
            }

            return data as ITour;
        });
    }
}