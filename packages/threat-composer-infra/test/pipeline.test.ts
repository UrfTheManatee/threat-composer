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
test('Snapshot', () => {
  const app = new App({
    context: {
      // Option 1: Set useCodeCommit to true
      useCodeCommit: true,

      // OR Option 2: Provide both required parameters
      // useCodeCommit: false,
      // codestarConnectionArn: 'arn:aws:codestar-connections:region:account:connection/example-id',
      // repositoryOwnerAndName: 'owner/repo-name'
    }
  });

  const stack = new PipelineStack(app, 'pipeline-test', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT!,
      region: process.env.CDK_DEFAULT_REGION!,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});