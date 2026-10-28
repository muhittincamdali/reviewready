import { describe, expect, it } from 'vitest';
import { pubspecDependencies } from '../../src/detect/project.js';

describe('pubspecDependencies', () => {
  it('lists the top-level dependencies, not their options or dev_dependencies', () => {
    const pubspec = `name: harvest
environment:
  sdk: ^3.11.0

dependencies:
  flutter:
    sdk: flutter

  # Icons.
  cupertino_icons: ^1.0.8
  camera: ^0.12.2
  local_auth:
    git:
      url: https://github.com/flutter/packages
      path: packages/local_auth/local_auth

dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.4.0

flutter:
  uses-material-design: true
`;
    expect([...pubspecDependencies(pubspec)]).toEqual([
      'flutter',
      'cupertino_icons',
      'camera',
      'local_auth',
    ]);
  });

  it('handles a pubspec without dependencies and a comment after the key', () => {
    expect([...pubspecDependencies('name: x\n')]).toEqual([]);
    expect([...pubspecDependencies('dependencies: # app\n    a: 1\n    b: 2\n')]).toEqual([
      'a',
      'b',
    ]);
  });
});
