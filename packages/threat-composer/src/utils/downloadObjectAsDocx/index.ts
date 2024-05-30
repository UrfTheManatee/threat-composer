/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ******************************************************************************************************************** */

import { HeadingLevel, Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';

const downloadObjectAsDocx = (exportObj: any) => {
  // Function to generate the document
  console.log(exportObj);
  //const { applicationInfo, architecture } = exportObj;

  // Create document
  // @ts-ignore
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'test',
            heading: HeadingLevel.TITLE,
          }),
          /**
          // Description Header
          new docx.Paragraph({
            text: 'Description',
            heading: docx.HeadingLevel.HEADING_1,
          }),
          // Description Content
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: applicationInfo.description,
                break: 1,
              }),
            ],
          }),
          // Architecture Header
          new docx.Paragraph({
            text: 'Architecture',
            heading: docx.HeadingLevel.HEADING_1,
          }),
          // Architecture Image
          new docx.Paragraph({
            children: [
              new docx.ImageRun({
                data: architecture.image, // base64 string from JSON
                transformation: {
                  width: 500,
                  height: 300,
                },
              }),
            ],
          }),
          // Assumptions Header
          new docx.Paragraph({
            text: 'Assumptions',
            heading: docx.HeadingLevel.HEADING_1,
          }),
          // Dynamically added Assumptions
          ...applicationInfo.assumptions.map((assumption: any) =>
            new docx.Paragraph({
              text: assumption,
              bullet: {
                level: 0,
              },
            }),
          ),**/
        ],
      },
    ],
  });

  // Use Packer to generate a blob and simulate a download


  void Packer.toBlob(doc).then(blob => {
    console.log(blob);
  });

  /**
   void docx.Packer.toBlob(doc).then((blob: Blob, exportName: string) => {
    const url = URL.createObjectURL(blob);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('download', exportName + '.docx');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

**/
};

export default downloadObjectAsDocx;