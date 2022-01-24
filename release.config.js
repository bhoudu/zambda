module.exports = {
  branches: [
    {
      name: 'develop',
      prerelease: true
    },
    {
      name: 'release',
      prerelease: true
    },
    {
      name: 'main'
    },
  ],
  plugins: [
    'semantic-release-gitmoji', {
      releaseRules: {
        major: [
          ':boom:',
        ],
        minor: [
          ':sparkles:',
          ':zap:',
          ':fire:',
          ':alembic:',
          ':tada:',
          ':rocket:',
        ],
        patch: [
          ':bug:',
          ':ambulance:',
          ':lock:',
          ':lipstick:',
          ':cop:',
          ':tv:',
          ':package:',
          ':recycle:',
        ]
      }
    },
    [
      "@semantic-release/github",
      {
        "assets": [
          "lib/**",
          "package.json",
          "README.md"
        ]
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'README.md',
          'package.json'
        ],
        message: 'chore(release): Release <%= nextRelease.version %> - <%= new Date().toLocaleDateString(\'en-US\', {year: \'numeric\', month: \'short\', day: \'numeric\', hour: \'numeric\', minute: \'numeric\' }) %> [skip ci]\\n\\n<%= nextRelease.notes %>'
      }
    ]
  ]
}
