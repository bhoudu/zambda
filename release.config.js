module.exports = {
  branches: [
    {
      name: 'develop',
      prerelease: true
    },
    {
      name: 'release',
      prerelease: 'rc'
    },
    {
      name: 'main'
    },
  ],
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: {
            include: [
              ':boom:',
            ]
          },
          minor: {
            include: [
              ':sparkles:',
              ':zap:',
              ':fire:',
              ':alembic:',
              ':tada:',
              ':rocket:',
            ],
          },
          patch: {
            include: [
              ':bug:',
              ':ambulance:',
              ':lock:',
              ':lipstick:',
              ':cop:',
              ':tv:',
              ':package:',
              ':recycle:',
              ':abc:',
              ":bento:",
              ":arrow_up:"
            ]
          }
        }
      }
    ],
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
    ],
    '@semantic-release/npm',
  ]
}
