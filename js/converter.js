/**
 * 人民币大小写转换工具
 * 实现人民币金额数字(小写)转换为大写的功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    // 获取DOM元素
    const amountInput = document.getElementById('amount');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultElement = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');
    
    // 绑定转换按钮点击事件
    convertBtn.addEventListener('click', function() {
        convertAmount();
    });
    
    // 绑定回车键事件
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertAmount();
        }
    });
    
    // 绑定清空按钮点击事件
    clearBtn.addEventListener('click', function() {
        amountInput.value = '';
        resultElement.textContent = '人民币 零元整';
        amountInput.focus();
    });
    
    // 绑定复制按钮点击事件
    copyBtn.addEventListener('click', function() {
        copyToClipboard(resultElement.textContent);
    });
    
    // 输入框实时验证
    amountInput.addEventListener('input', function() {
        // 只允许输入数字和小数点
        this.value = this.value.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        if (this.value.split('.').length > 2) {
            this.value = this.value.replace(/\.+$/, '');
        }
        // 限制小数点后最多两位
        if (this.value.includes('.')) {
            const parts = this.value.split('.');
            if (parts[1].length > 2) {
                this.value = parts[0] + '.' + parts[1].substring(0, 2);
            }
        }
    });
    
    /**
     * 转换金额函数
     */
    function convertAmount() {
        const amount = amountInput.value.trim();
        
        // 验证输入
        if (!amount) {
            showError('请输入金额');
            return;
        }
        
        // 验证金额格式
        if (!isValidAmount(amount)) {
            showError('请输入有效的金额，如：1234.56');
            return;
        }
        
        // 转换为大写
        const capitalizedAmount = convertToChinese(amount);
        resultElement.textContent = capitalizedAmount;
        resultElement.style.color = '#333';
    }
    
    /**
     * 验证金额是否有效
     * @param {string} amount - 金额字符串
     * @return {boolean} 是否有效
     */
    function isValidAmount(amount) {
        // 金额格式正则：允许整数或最多两位小数的正数
        const amountRegex = /^\d+(\.\d{1,2})?$/;
        return amountRegex.test(amount);
    }
    
    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     */
    function showError(message) {
        resultElement.textContent = message;
        resultElement.style.color = '#e53935';
        setTimeout(() => {
            resultElement.style.color = '#333';
        }, 3000);
    }
    
    /**
     * 复制内容到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        // 创建临时textarea元素
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            // 执行复制命令
            document.execCommand('copy');
            // 显示复制成功提示
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '复制成功！';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
        
        // 移除临时元素
        document.body.removeChild(textarea);
    }
    
    /**
     * 将数字金额转换为中文大写金额
     * @param {string} money - 数字金额字符串
     * @return {string} 中文大写金额
     */
    function convertToChinese(money) {
        // 数字对应的中文
        const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        // 单位
        const cnIntRadice = ['', '拾', '佰', '仟'];
        // 大单位
        const cnIntUnits = ['', '万', '亿', '兆'];
        // 小数单位
        const cnDecUnits = ['角', '分'];
        // 整数部分和小数部分
        const parts = money.split('.');
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : '';
        
        // 结果字符串
        let result = '人民币';
        
        // 处理整数部分
        if (parseInt(integerPart, 10) > 0) {
            let zeroCount = 0;
            const intLen = integerPart.length;
            
            for (let i = 0; i < intLen; i++) {
                const n = integerPart.substr(i, 1);
                const p = intLen - i - 1;
                const q = p / 4;
                const m = p % 4;
                
                if (n === '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        result += cnNums[0];
                    }
                    zeroCount = 0;
                    result += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                
                if (m === 0 && zeroCount < 4) {
                    result += cnIntUnits[Math.floor(q)];
                }
            }
            
            result += '元';
        } else {
            result += '零元';
        }
        
        // 处理小数部分
        if (decimalPart === '' || decimalPart === '00') {
            result += '整';
        } else {
            for (let i = 0; i < decimalPart.length; i++) {
                if (i > 1) break; // 只处理到分
                const n = decimalPart.substr(i, 1);
                if (n !== '0') {
                    result += cnNums[Number(n)] + cnDecUnits[i];
                } else if (i === 0 && decimalPart.charAt(1) !== '0') {
                    // 角位是0但分位不是0，需要加"零"
                    result += cnNums[0];
                }
            }
        }
        
        return result;
    }
});