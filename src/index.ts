import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { KernelError, Notebook, NotebookActions } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICodeCellModel } from '@jupyterlab/cells';

import { checkBrowserNotificationSettings } from './settings';

/**
 * Constructs notification message and displays it.
 */
function displayNotification(
  cellDuration: string,
  cellNumber: number,
  notebookName: string,
  reportCellNumber: boolean,
  reportCellExecutionTime: boolean,
  failedExecution: boolean,
  error: KernelError | null
): void {
  const notificationPayload = {
    icon: '/static/favicon.ico',
    body: ''
  };
  const title = failedExecution
    ? `${notebookName} Failed!`
    : `${notebookName} Completed!`;
  let message = '';

  if (failedExecution) {
    message = error ? `${error.errorName} ${error.errorValue}` : '';
  } else if (reportCellNumber && reportCellExecutionTime) {
    message = `Cell[${cellNumber}] Duration: ${cellDuration}`;
  } else if (reportCellNumber) {
    message = `Cell Number: ${cellNumber}`;
  } else if (reportCellExecutionTime) {
    message = `Cell Duration: ${cellDuration}`;
  }

  notificationPayload.body = message;
  new Notification(title, notificationPayload);
}

/**
 * Trigger notification.
 */
function triggerNotification(
  cell: Cell,
  notebook: Notebook,
  cellStartTime: Date,
  cellEndTime: Date,
  minimumCellExecutionTime: number,
  reportCellNumber: boolean,
  reportCellExecutionTime: boolean,
  cellNumberType: string,
  failedExecution: boolean,
  error: KernelError | null
) {
  const codeCell = cell.model.type === 'code';
  const nonEmptyCell = cell.model.value.text.length > 0;
  const codeCellModel = cell.model as ICodeCellModel;

  if (codeCell && nonEmptyCell) {
    const diff = new Date(<any>cellEndTime - <any>cellStartTime);
    if (diff.getSeconds() >= minimumCellExecutionTime) {
      const cellDuration = diff.toISOString().substr(11, 8);
      const cellNumber =
        cellNumberType === 'cell_index'
          ? notebook.activeCellIndex
          : codeCellModel.executionCount;
      const notebookName = notebook.title.label.replace(/\.[^/.]+$/, '');
      displayNotification(
        cellDuration,
        cellNumber,
        notebookName,
        reportCellNumber,
        reportCellExecutionTime,
        failedExecution,
        error
      );
    }
  }
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-notifications:plugin',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: async (app: JupyterFrontEnd, settingRegistry: ISettingRegistry) => {
    checkBrowserNotificationSettings();
    let enabled = true;
    let minimumCellExecutionTime = 60;
    let reportCellExecutionTime = true;
    let reportCellNumber = true;
    let cellNumberType = 'cell_index';

    if (settingRegistry) {
      const setting = await settingRegistry.load(extension.id);
      const updateSettings = (): void => {
        enabled = setting.get('enabled').composite as boolean;
        minimumCellExecutionTime = setting.get('minimum_cell_execution_time')
          .composite as number;
        reportCellExecutionTime = setting.get('report_cell_execution_time')
          .composite as boolean;
        reportCellNumber = setting.get('report_cell_number')
          .composite as boolean;
        cellNumberType = setting.get('cell_number_type').composite as string;
      };
      updateSettings();
      setting.changed.connect(updateSettings);
    }

    let cellStartTime = new Date();

    NotebookActions.executionScheduled.connect((_, args) => {
      if (enabled) {
        cellStartTime = new Date();
      }
    });

    NotebookActions.executed.connect((_, args) => {
      if (enabled) {
        const { cell, notebook, success, error } = args;
        const cellEndTime = new Date();
        triggerNotification(
          cell,
          notebook,
          cellStartTime,
          cellEndTime,
          minimumCellExecutionTime,
          reportCellNumber,
          reportCellExecutionTime,
          cellNumberType,
          !success,
          error
        );
      }
    });
  }
};

export default extension;
