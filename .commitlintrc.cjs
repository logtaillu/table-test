module.exports = {
    extends: ['@commitlint/config-conventional'],
    prompt: {
        scopes: [],
        enableMultipleScopes: true,
        scopeEnumSeparator: ",",
        customScopesAlias: '自定义',
        allowCustomScopes: false,
        emptyScopesAlias: '跳过',
        allowEmptyScopes: false,
        types: [
            { value: 'feat', name: 'feat:     新增功能 | A new feature' },
            { value: 'fix', name: 'fix:      修复缺陷 | A bug fix' },
            { value: 'docs', name: 'docs:     文档更新 | Documentation only changes' },
            { value: 'style', name: 'style:    代码格式 | Changes that do not affect the meaning of the code' },
            { value: 'refactor', name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature' },
            { value: 'perf', name: 'perf:     性能提升 | A code change that improves performance' },
            { value: 'test', name: 'test:     测试相关 | Adding missing tests or correcting existing tests' },
            { value: 'build', name: 'build:    构建相关 | Changes that affect the build system or external dependencies' },
            { value: 'ci', name: 'ci:       持续集成 | Changes to our CI configuration files and scripts' },
            { value: 'revert', name: 'revert:   回退代码 | Revert to a commit' },
            { value: 'chore', name: 'chore:    其他修改 | Other changes that do not modify src or test files' },
        ],
        useEmoji: false,
        skipQuestions: ["footerPrefix", "footer", "scope"]
    }
}